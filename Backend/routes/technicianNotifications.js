import express from "express";

import { db } from "../config/db.js";

import {
  verifyTechnicianToken,
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
==========================================
GET TECHNICIAN NOTIFICATIONS
==========================================
*/

router.get(
  "/",

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
            user_id,
            title,
            message,
            is_read,
            created_at

          FROM notifications

          WHERE user_id = ?

          ORDER BY created_at DESC
          `,
          [
            technicianId
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
GET UNREAD COUNT
==========================================
*/

router.get(
  "/unread-count",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      const [rows] =
        await db.query(
          `
          SELECT
            COUNT(*) AS unreadCount

          FROM notifications

          WHERE user_id = ?

          AND is_read = 0
          `,
          [
            technicianId
          ]
        );


      return res.json({

        success: true,

        unreadCount:
          rows[0].unreadCount

      });

    } catch (error) {

      console.error(
        "Unread notification count error:",
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
MARK SINGLE NOTIFICATION AS READ
==========================================
*/

router.put(
  "/:id/read",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      const notificationId =
        req.params.id;


      const [result] =
        await db.query(
          `
          UPDATE notifications

          SET is_read = 1

          WHERE id = ?

          AND user_id = ?
          `,
          [
            notificationId,
            technicianId
          ]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          msg:
            "Notification not found"

        });

      }


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
MARK ALL AS READ
==========================================
*/

router.put(
  "/read-all",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      await db.query(
        `
        UPDATE notifications

        SET is_read = 1

        WHERE user_id = ?
        `,
        [
          technicianId
        ]
      );


      return res.json({

        success: true,

        msg:
          "All notifications marked as read"

      });

    } catch (error) {

      console.error(
        "Mark all notifications read error:",
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
==========================================
*/

router.delete(
  "/:id",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      const notificationId =
        req.params.id;


      const [result] =
        await db.query(
          `
          DELETE FROM notifications

          WHERE id = ?

          AND user_id = ?
          `,
          [
            notificationId,
            technicianId
          ]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          msg:
            "Notification not found"

        });

      }


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