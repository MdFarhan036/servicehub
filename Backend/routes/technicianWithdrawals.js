import express from "express";

import { db } from "../config/db.js";

import {
  verifyTechnicianToken,
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
==========================================
GET TECHNICIAN WALLET SUMMARY
==========================================
*/

router.get(
  "/wallet",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      /*
      =====================================
      GET TECHNICIAN WALLET
      =====================================
      */

      const [walletRows] =
        await db.query(
          `
          SELECT
            id,
            technician_id,
            balance,
            total_earned,
            total_withdrawn,
            pending_withdrawal,
            status,
            created_at,
            updated_at
          FROM technician_wallets
          WHERE technician_id = ?
          LIMIT 1
          `,
          [
            technicianId
          ]
        );


      /*
      WALLET NOT FOUND
      */

      if (
        walletRows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          msg:
            "Technician wallet not found"

        });

      }


      const wallet =
        walletRows[0];


      /*
      AVAILABLE BALANCE

      Balance - Reserved/Pending Withdrawals
      */

      const availableBalance =
        Number(wallet.balance || 0) -
        Number(wallet.pending_withdrawal || 0);


      return res.json({

        success: true,

        wallet: {

          id:
            wallet.id,

          technicianId:
            wallet.technician_id,

          balance:
            Number(wallet.balance || 0),

          totalEarnings:
            Number(wallet.total_earned || 0),

          totalWithdrawn:
            Number(wallet.total_withdrawn || 0),

          pendingWithdrawal:
            Number(
              wallet.pending_withdrawal || 0
            ),

          availableBalance,

          status:
            wallet.status

        }

      });

    } catch (error) {

      console.error(
        "Wallet error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch wallet"

      });

    }

  }
);


/*
==========================================
REQUEST WITHDRAWAL

POST /api/technician-withdrawals
==========================================
*/

router.post(
  "/",

  verifyTechnicianToken,

  async (req, res) => {

    const connection =
      await db.getConnection();


    try {

      await connection.beginTransaction();


      const technicianId =
        req.user.id;


      const {

        amount,

        payment_method,

        account_details

      } = req.body;


      const withdrawalAmount =
        Number(amount);


      /*
      =====================================
      VALIDATION
      =====================================
      */

      if (
        !withdrawalAmount ||
        withdrawalAmount <= 0
      ) {

        await connection.rollback();


        return res.status(400).json({

          success: false,

          msg:
            "Valid withdrawal amount is required"

        });

      }


      if (!payment_method) {

        await connection.rollback();


        return res.status(400).json({

          success: false,

          msg:
            "Payment method is required"

        });

      }


      /*
      =====================================
      LOCK TECHNICIAN WALLET

      Prevent multiple withdrawal requests
      at the same time.
      =====================================
      */

      const [walletRows] =
        await connection.query(
          `
          SELECT
            *
          FROM technician_wallets
          WHERE technician_id = ?
          FOR UPDATE
          `,
          [
            technicianId
          ]
        );


      /*
      WALLET NOT FOUND
      */

      if (
        walletRows.length === 0
      ) {

        await connection.rollback();


        return res.status(404).json({

          success: false,

          msg:
            "Technician wallet not found"

        });

      }


      const wallet =
        walletRows[0];


      /*
      CHECK WALLET STATUS
      */

      if (
        wallet.status !==
        "active"
      ) {

        await connection.rollback();


        return res.status(403).json({

          success: false,

          msg:
            "Wallet is not active"

        });

      }


      /*
      =====================================
      CALCULATE AVAILABLE BALANCE
      =====================================
      */

      const availableBalance =
        Number(wallet.balance || 0) -
        Number(
          wallet.pending_withdrawal || 0
        );


      /*
      CHECK BALANCE
      */

      if (
        withdrawalAmount >
        availableBalance
      ) {

        await connection.rollback();


        return res.status(400).json({

          success: false,

          msg:
            "Insufficient wallet balance",

          availableBalance

        });

      }


      /*
      =====================================
      CREATE WITHDRAWAL REQUEST
      =====================================
      */

      const [result] =
        await connection.query(
          `
          INSERT INTO withdrawals
          (
            technician_id,
            amount,
            payment_method,
            account_details,
            status
          )
          VALUES
          (
            ?, ?, ?, ?, 'pending'
          )
          `,
          [

            technicianId,

            withdrawalAmount,

            payment_method,

            account_details || null

          ]
        );


      /*
      =====================================
      RESERVE THE MONEY

      Add amount to pending withdrawal.
      The balance itself remains unchanged
      until admin marks it as PAID.
      =====================================
      */

      await connection.query(
        `
        UPDATE technician_wallets

        SET

          pending_withdrawal =
            pending_withdrawal + ?,

          updated_at =
            NOW()

        WHERE technician_id = ?
        `,
        [

          withdrawalAmount,

          technicianId

        ]
      );


      await connection.commit();


      return res.status(201).json({

        success: true,

        msg:
          "Withdrawal request submitted",

        withdrawalId:
          result.insertId,

        requestedAmount:
          withdrawalAmount,

        availableBalance:
          availableBalance -
          withdrawalAmount

      });

    } catch (error) {

      await connection.rollback();


      console.error(
        "Withdrawal request error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to submit withdrawal request"

      });

    } finally {

      connection.release();

    }

  }
);

/*
==========================================
GET MY WITHDRAWAL HISTORY
GET /api/technician-withdrawals/history
==========================================
*/

router.get(
  "/history",
  verifyTechnicianToken,
  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      const [rows] =
        await db.query(
          `
          SELECT
            id,
            technician_id,
            amount,
            payment_method,
            account_details,
            status,
            rejection_reason,
            requested_at,
            processed_at

          FROM withdrawals

          WHERE technician_id = ?

          ORDER BY
            requested_at DESC
          `,
          [
            technicianId
          ]
        );


      return res.json({

        success: true,

        withdrawals:
          rows

      });

    } catch (error) {

      console.error(
        "Withdrawal history error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch withdrawals"

      });

    }

  }
);


export default router;