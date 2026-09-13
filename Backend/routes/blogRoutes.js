import express from "express";
import { db } from "../config/db.js";

const router = express.Router();


// ======================================
// GET BLOG PAGE SETTINGS
// ======================================
router.get(
  "/page-settings",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT *
          FROM blog_page
          LIMIT 1
        `);

      res.json(
        rows[0] || null
      );

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Failed to fetch blog page settings"
      });
    }
  }
);


// ======================================
// GET ALL BLOGS
// ======================================
router.get(
  "/",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT 
            id,
            title,
            slug,
            category,
            author,
            short_description,
            image,
            publish_date,
            is_featured
          FROM blogs
          ORDER BY publish_date DESC
        `);

      res.json(rows);

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Failed to fetch blogs"
      });
    }
  }
);


// ======================================
// RELATED BLOGS
// IMPORTANT: keep before /:slug
// ======================================
router.get(
  "/related/:slug",
  async (req, res) => {
    try {
      const [currentBlog] =
        await db.query(
          `
          SELECT category
          FROM blogs
          WHERE slug=?
          LIMIT 1
        `,
          [req.params.slug]
        );

      if (
        !currentBlog.length
      ) {
        return res.json([]);
      }

      const category =
        currentBlog[0]
          .category;

      const [related] =
        await db.query(
          `
          SELECT
            id,
            title,
            slug
          FROM blogs
          WHERE category=?
          AND slug!=?
          ORDER BY id DESC
          LIMIT 5
        `,
          [
            category,
            req.params.slug
          ]
        );

      res.json(
        related
      );

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Failed to fetch related blogs"
      });
    }
  }
);


// ======================================
// SINGLE BLOG
// keep this LAST
// ======================================
router.get(
  "/:slug",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(
          `
          SELECT *
          FROM blogs
          WHERE slug=?
          LIMIT 1
        `,
          [req.params.slug]
        );

      if (
        rows.length === 0
      ) {
        return res
          .status(404)
          .json({
            msg:
              "Blog not found"
          });
      }

      res.json(
        rows[0]
      );

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Failed to fetch blog"
      });
    }
  }
);

export default router;