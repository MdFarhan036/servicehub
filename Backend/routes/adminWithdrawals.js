import express from "express";

import { db } from "../config/db.js";

import {
  verifyAdminToken,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
=====================================================
ALL ADMIN WITHDRAWAL ROUTES
=====================================================

Security:

1. Verify admin cookie
2. Verify admin role

COOKIE:
admin_token
*/

router.use(
  verifyAdminToken,
  adminOnly
);


/*
=====================================================
GET ALL WITHDRAWAL REQUESTS

GET
/api/admin/withdrawals
=====================================================
*/

router.get(
  "/",
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT

            wr.id,

            wr.technician_id,

            wr.amount,

            wr.status,

            wr.payment_method,

            wr.account_details,

          wr.requested_at,
wr.processed_at,


            u.name AS technician_name,

            u.email AS technician_email,

            u.phone AS technician_phone,


            w.balance AS wallet_balance


          FROM withdrawals wr


          INNER JOIN users u
          ON u.id = wr.technician_id


          LEFT JOIN technician_wallets w
          ON w.technician_id = wr.technician_id


          ORDER BY

            CASE

              WHEN wr.status = 'pending'
              THEN 1

              WHEN wr.status = 'approved'
              THEN 2

              WHEN wr.status = 'paid'
              THEN 3

              WHEN wr.status = 'rejected'
              THEN 4

              ELSE 5

            END,

        wr.requested_at DESC
          `
        );


      return res.json({

        success: true,

        withdrawals:
          rows

      });

    } catch (error) {

      console.error(
        "Admin withdrawals error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch withdrawal requests"

      });

    }

  }
);


/*
=====================================================
GET SINGLE WITHDRAWAL REQUEST

GET
/api/admin/withdrawals/:id
=====================================================
*/

router.get(
  "/:id",

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT

            wr.*,

            u.name AS technician_name,

            u.email AS technician_email,

            u.phone AS technician_phone


          FROM withdrawals wr


          INNER JOIN users u
          ON u.id = wr.technician_id


          WHERE wr.id = ?

          LIMIT 1
          `,
          [
            req.params.id
          ]
        );


      if (
        rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          msg:
            "Withdrawal request not found"

        });

      }


      return res.json({

        success: true,

        withdrawal:
          rows[0]

      });

    } catch (error) {

      console.error(
        "Get withdrawal error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch withdrawal"

      });

    }

  }
);


/*
=====================================================
APPROVE WITHDRAWAL

PUT
/api/admin/withdrawals/:id/approve
=====================================================
*/
router.put(
  "/:id/approve",

  async (req, res) => {

    try {

      const withdrawalId = req.params.id;


      const [requests] =
        await db.query(
          `
          SELECT
            id,
            status

          FROM withdrawals

          WHERE id = ?
          `,
          [withdrawalId]
        );


      if (!requests.length) {

        return res.status(404).json({
          success: false,
          msg: "Withdrawal request not found"
        });

      }


      if (
        requests[0].status !== "pending"
      ) {

        return res.status(400).json({
          success: false,
          msg: "Only pending withdrawals can be approved"
        });

      }


      await db.query(
        `
        UPDATE withdrawals

        SET
          status = 'approved'

        WHERE id = ?
        `,
        [withdrawalId]
      );


      return res.json({
        success: true,
        msg: "Withdrawal approved successfully"
      });

    } catch (error) {

      console.error(
        "Approve withdrawal error:",
        error
      );

      return res.status(500).json({
        success: false,
        msg: "Failed to approve withdrawal"
      });

    }

  }
);

/*
=====================================================
REJECT WITHDRAWAL

PUT
/api/admin/withdrawals/:id/reject
=====================================================
*/

router.put(
  "/:id/reject",

  async (req, res) => {

    try {

      const withdrawalId =
        req.params.id;

      const {
        rejection_reason
      } = req.body;


      const [requests] =
        await db.query(
          `
          SELECT
            id,
            status

          FROM withdrawals

          WHERE id = ?
          `,
          [withdrawalId]
        );


      if (!requests.length) {

        return res.status(404).json({
          success: false,
          msg: "Withdrawal request not found"
        });

      }


      if (
        requests[0].status !== "pending"
      ) {

        return res.status(400).json({
          success: false,
          msg:
            "Only pending withdrawals can be rejected"
        });

      }


      await db.query(
        `
        UPDATE withdrawals

        SET

          status = 'rejected',

          rejection_reason = ?,

          processed_at = NOW()

        WHERE id = ?
        `,
        [
          rejection_reason || null,
          withdrawalId
        ]
      );


      return res.json({

        success: true,

        msg:
          "Withdrawal rejected successfully"

      });

    } catch (error) {

      console.error(
        "Reject withdrawal error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to reject withdrawal"

      });

    }

  }
);


/*
=====================================================
MARK WITHDRAWAL AS PAID

PUT
/api/admin/withdrawals/:id/paid
=====================================================

IMPORTANT:

Only APPROVED withdrawals
can be marked as PAID.
*/
router.put(
  "/:id/paid",

  async (req, res) => {

    const connection =
      await db.getConnection();

    try {

      await connection.beginTransaction();


      const withdrawalId =
        req.params.id;


      /*
      LOCK WITHDRAWAL
      */

      const [requests] =
        await connection.query(
          `
          SELECT *

          FROM withdrawals

          WHERE id = ?

          FOR UPDATE
          `,
          [withdrawalId]
        );


      if (!requests.length) {

        await connection.rollback();

        return res.status(404).json({

          success: false,

          msg:
            "Withdrawal request not found"

        });

      }


      const withdrawal =
        requests[0];


      /*
      ONLY APPROVED REQUESTS
      */

      if (
        withdrawal.status !==
        "approved"
      ) {

        await connection.rollback();

        return res.status(400).json({

          success: false,

          msg:
            "Only approved withdrawals can be marked as paid"

        });

      }


      /*
      MARK PAID
      */

      await connection.query(
        `
        UPDATE withdrawals

        SET

          status = 'paid',

          processed_at = NOW()

        WHERE id = ?
        `,
        [withdrawalId]
      );


      await connection.commit();


      return res.json({

        success: true,

        msg:
          "Withdrawal marked as paid successfully"

      });

    } catch (error) {

      await connection.rollback();

      console.error(
        "Payment error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to mark withdrawal as paid"

      });

    } finally {

      connection.release();

    }

  }
);

export default router;