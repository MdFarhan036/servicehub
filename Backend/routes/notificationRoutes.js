import express from "express";

import { db } from "../config/db.js";

import {
  verifyAdminToken,
  verifyTechnicianToken,
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
==========================================
GET ADMIN NOTIFICATIONS
GET /api/notifications/admin
==========================================
*/

router.get(
  "/admin",

  verifyAdminToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            user_id,
            role,
            title,
            message,
            is_read,
            created_at

          FROM notifications

          WHERE user_id = ?
          AND role = 'admin'

          ORDER BY created_at DESC
          `,
          [
            req.user.id
          ]
        );


      return res.json({

        success: true,

        notifications:
          rows

      });

    } catch (error) {

      console.error(
        "Get admin notifications error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch notifications"

      });

    }

  }
);


/*
==========================================
GET TECHNICIAN NOTIFICATIONS
GET /api/notifications/technician
==========================================
*/

router.get(
  "/technician",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            user_id,
            role,
            title,
            message,
            is_read,
            created_at

          FROM notifications

          WHERE user_id = ?
          AND role = 'technician'

          ORDER BY created_at DESC
          `,
          [
            req.user.id
          ]
        );


      return res.json({

        success: true,

        notifications:
          rows

      });

    } catch (error) {

      console.error(
        "Get technician notifications error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch notifications"

      });

    }

  }
);


/*
==========================================
GET ADMIN UNREAD COUNT
GET /api/notifications/admin/unread-count
==========================================
*/

router.get(
  "/admin/unread-count",

  verifyAdminToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            COUNT(*) AS unreadCount

          FROM notifications

          WHERE user_id = ?
          AND role = 'admin'
          AND is_read = 0
          `,
          [
            req.user.id
          ]
        );


      return res.json({

        success: true,

        unreadCount:
          rows[0].unreadCount

      });

    } catch (error) {

      console.error(
        "Admin unread count error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch unread count"

      });

    }

  }
);


/*
==========================================
GET TECHNICIAN UNREAD COUNT
GET /api/notifications/technician/unread-count
==========================================
*/

router.get(
  "/technician/unread-count",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            COUNT(*) AS unreadCount

          FROM notifications

          WHERE user_id = ?
          AND role = 'technician'
          AND is_read = 0
          `,
          [
            req.user.id
          ]
        );


      return res.json({

        success: true,

        unreadCount:
          rows[0].unreadCount

      });

    } catch (error) {

      console.error(
        "Technician unread count error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch unread count"

      });

    }

  }
);


/*
==========================================
MARK ONE NOTIFICATION AS READ
PUT /api/notifications/:id/read
==========================================
*/

router.put(
  "/:id/read",

  async (req, res) => {

    try {

      await db.query(
        `
        UPDATE notifications

        SET is_read = 1

        WHERE id = ?
        `,
        [
          req.params.id
        ]
      );


      return res.json({

        success: true,

        msg:
          "Notification marked as read"

      });

    } catch (error) {

      console.error(
        "Mark notification read error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to update notification"

      });

    }

  }
);


/*
==========================================
MARK ALL ADMIN NOTIFICATIONS AS READ
PUT /api/notifications/admin/read-all
==========================================
*/

router.put(
  "/admin/read-all",

  verifyAdminToken,

  async (req, res) => {

    try {

      await db.query(
        `
        UPDATE notifications

        SET is_read = 1

        WHERE user_id = ?
        AND role = 'admin'
        `,
        [
          req.user.id
        ]
      );


      return res.json({

        success: true,

        msg:
          "All notifications marked as read"

      });

    } catch (error) {

      console.error(
        "Admin read all error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to update notifications"

      });

    }

  }
);


/*
==========================================
MARK ALL TECHNICIAN NOTIFICATIONS AS READ
PUT /api/notifications/technician/read-all
==========================================
*/

router.put(
  "/technician/read-all",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      await db.query(
        `
        UPDATE notifications

        SET is_read = 1

        WHERE user_id = ?
        AND role = 'technician'
        `,
        [
          req.user.id
        ]
      );


      return res.json({

        success: true,

        msg:
          "All notifications marked as read"

      });

    } catch (error) {

      console.error(
        "Technician read all error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to update notifications"

      });

    }

  }
);


/*
==========================================
DELETE NOTIFICATION
DELETE /api/notifications/:id
==========================================
*/

router.delete(
  "/:id",

  async (req, res) => {

    try {

      await db.query(
        `
        DELETE FROM notifications

        WHERE id = ?
        `,
        [
          req.params.id
        ]
      );


      return res.json({

        success: true,

        msg:
          "Notification deleted"

      });

    } catch (error) {

      console.error(
        "Delete notification error:",
        error
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to delete notification"

      });

    }

  }
);


export default router;