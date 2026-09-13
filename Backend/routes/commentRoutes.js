import express from "express";
import { db } from "../config/db.js";
import { verifyAdminToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post(
  "/",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const {
        service_id,
        comment,
        rating
      } = req.body;

      const user_id =
        req.user.id;

      if (
        !service_id ||
        !comment ||
        !rating
      ) {
        return res
          .status(400)
          .json({
            msg:
              "All fields required"
          });
      }

      /* CHECK COMPLETED BOOKING */
      const [bookings] =
        await db.query(
          `
          SELECT *
          FROM bookings
          WHERE user_id = ?
          AND service_id = ?
          AND status = 'completed'
        `,
          [
            user_id,
            service_id
          ]
        );

      if (
        bookings.length ===
        0
      ) {
        return res
          .status(403)
          .json({
            msg:
              "You can review only after completed booking"
          });
      }

      /* PREVENT DUPLICATE REVIEW */
      const [existing] =
        await db.query(
          `
          SELECT id
          FROM comments
          WHERE user_id = ?
          AND service_id = ?
        `,
          [
            user_id,
            service_id
          ]
        );

      if (
        existing.length >
        0
      ) {
        return res
          .status(400)
          .json({
            msg:
              "You already reviewed this service"
          });
      }

      await db.query(
        `
        INSERT INTO comments
        (
          user_id,
          service_id,
          comment,
          rating,
          is_approved
        )
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          user_id,
          service_id,
          comment,
          rating,
          0
        ]
      );

      res.json({
        msg:
          "Review submitted successfully"
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Review submission failed"
      });
    }
  }
);


// =======================================
// GET ALL REVIEWS
// =======================================
router.get(
  "/comments",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT 
            c.*,
            u.name AS user_name,
            s.title AS service_title
          FROM comments c
          LEFT JOIN users u
            ON c.user_id = u.id
          LEFT JOIN services s
            ON c.service_id = s.id
          ORDER BY c.id DESC
        `);

      res.json(rows);

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg:
          "Failed to fetch reviews"
      });
    }
  }
);


// =======================================
// APPROVE / REJECT REVIEW
// =======================================
router.put(
  "/comments/:id",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const {
        is_approved
      } = req.body;

      await db.query(
        `
        UPDATE comments
        SET is_approved = ?
        WHERE id = ?
      `,
        [
          is_approved,
          req.params.id
        ]
      );

      res.json({
        msg:
          "Review updated"
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg:
          "Update failed"
      });
    }
  }
);


// =======================================
// DELETE REVIEW
// =======================================
router.delete(
  "/comments/:id",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      await db.query(
        `
        DELETE FROM comments
        WHERE id = ?
      `,
        [
          req.params.id
        ]
      );

      res.json({
        msg:
          "Review deleted"
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg:
          "Delete failed"
      });
    }
  }
);
// =======================================
// PUBLIC APPROVED REVIEWS (CUSTOMER PAGE)
// =======================================
router.get(
  "/approved",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT 
            c.id,
            c.comment,
            c.rating,
            c.created_at,
            u.name AS user_name,
            s.title AS service_title
          FROM comments c
          LEFT JOIN users u
            ON c.user_id = u.id
          LEFT JOIN services s
            ON c.service_id = s.id
          WHERE c.is_approved = 1
          ORDER BY c.id DESC
        `);

      res.json(rows);

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Failed to fetch approved reviews"
      });
    }
  }
);
export default router;