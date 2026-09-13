import express from "express";
import { db } from "../config/db.js";
import { verifyAdminToken, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  getAbout,
  upsertAbout
} from "../controllers/aboutController.js";

import {
  getHighlights,
  getHighlightById,
  createHighlight,
  updateHighlight,
  deleteHighlight
} from "../controllers/highlightController.js";

import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialsPage,
  updateTestimonialsPage
} from "../controllers/testimonialController.js";

const router = express.Router();

/* ADMIN CHECK */
const isAdmin = (
  req,
  res,
  next
) => {
  if (
    req.user.role !==
    "admin"
  ) {
    return res
      .status(403)
      .json({
        msg:
          "Admin only"
      });
  }

  next();
};

/* ================= DASHBOARD STATS ================= */
router.get(
  "/stats",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    const [[services]] =
      await db.query(
        "SELECT COUNT(*) as count FROM services"
      );

    const [[bookings]] =
      await db.query(
        "SELECT COUNT(*) as count FROM bookings"
      );

    const [[comments]] =
      await db.query(
        "SELECT COUNT(*) as count FROM comments"
      );

    res.json({
      services:
        services.count,
      bookings:
        bookings.count,
      comments:
        comments.count
    });
  }
);

/* ================= ABOUT PAGE ================= */

/* FIXED FILE FIELDS */
const multiUpload =
  upload.fields([
    {
      name:
        "hero_image",
      maxCount: 1
    },
    {
      name:
        "intro_image",
      maxCount: 1
    }
  ]);

router.get(
  "/about",
  getAbout
);

router.put(
  "/about",
  multiUpload,
  upsertAbout
);

/* ================= HIGHLIGHTS ================= */
router.get(
  "/highlights",
  getHighlights
);

router.get(
  "/highlights/:id",
  getHighlightById
);

router.post(
  "/highlights",
  createHighlight
);

router.put(
  "/highlights/:id",
  updateHighlight
);

router.delete(
  "/highlights/:id",
  deleteHighlight
);

/* ================= TESTIMONIALS ================= */
router.get(
  "/testimonials",
  getTestimonials
);

router.get(
  "/testimonials/:id",
  getTestimonial
);

router.post(
  "/testimonials",
  upload.single(
    "image"
  ),
  createTestimonial
);

router.put(
  "/testimonials/:id",
  upload.single(
    "image"
  ),
  updateTestimonial
);

router.delete(
  "/testimonials/:id",
  deleteTestimonial
);

/* ================= TESTIMONIAL PAGE SETTINGS ================= */
router.get(
  "/testimonials-page",
  getTestimonialsPage
);

router.put(
  "/testimonials-page",
  upload.fields([
    {
      name:
        "hero_image",
      maxCount: 1
    },
    {
      name:
        "about_image",
      maxCount: 1
    }
  ]),
  updateTestimonialsPage
);

/* ================= COMMENTS ================= */

/* GET REVIEWS */
router.get(
  "/comments",
  verifyAdminToken, adminOnly,
  async (
    req,
    res
  ) => {
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
      console.error(
        err
      );

      res.status(500).json({
        msg:
          "Failed to fetch reviews"
      });
    }
  }
);

/* APPROVE REVIEW */
router.put(
  "/comments/:id",
  verifyAdminToken, adminOnly,
  async (
    req,
    res
  ) => {
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
      console.error(
        err
      );

      res.status(500).json({
        msg:
          "Update failed"
      });
    }
  }
);

/* DELETE REVIEW */
router.delete(
  "/comments/:id",
  verifyAdminToken, adminOnly,
  async (
    req,
    res
  ) => {
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
      console.error(
        err
      );

      res.status(500).json({
        msg:
          "Delete failed"
      });
    }
  }
);

export default router;