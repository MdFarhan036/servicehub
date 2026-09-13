import express from "express";
import { db } from "../config/db.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// =====================================
// BLOG PAGE SETTINGS
// =====================================

// GET
router.get(
  "/blog-page",
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


// UPDATE
router.put(
  "/blog-page",
  async (req, res) => {
    try {
      const {
        hero_title,
        hero_subtitle,
        newsletter_title,
        newsletter_subtitle
      } = req.body;

      const [existing] =
        await db.query(`
          SELECT id
          FROM blog_page
          LIMIT 1
        `);

      if (
        existing.length > 0
      ) {
        await db.query(
          `
          UPDATE blog_page
          SET
            hero_title=?,
            hero_subtitle=?,
            newsletter_title=?,
            newsletter_subtitle=?
          WHERE id=?
        `,
          [
            hero_title,
            hero_subtitle,
            newsletter_title,
            newsletter_subtitle,
            existing[0].id
          ]
        );

        return res.json({
          msg:
            "Blog page updated successfully"
        });
      }

      await db.query(
        `
        INSERT INTO blog_page (
          hero_title,
          hero_subtitle,
          newsletter_title,
          newsletter_subtitle
        )
        VALUES (?, ?, ?, ?)
      `,
        [
          hero_title,
          hero_subtitle,
          newsletter_title,
          newsletter_subtitle
        ]
      );

      res.json({
        msg:
          "Blog page created successfully"
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Failed to save blog page settings"
      });
    }
  }
);


// =====================================
// BLOG CRUD
// =====================================

// GET ALL BLOGS
router.get(
  "/blogs",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT *
          FROM blogs
          ORDER BY id DESC
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


// GET SINGLE BLOG
router.get(
  "/blogs/:id",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(
          `
          SELECT *
          FROM blogs
          WHERE id=?
        `,
          [req.params.id]
        );

      res.json(
        rows[0] || null
      );

    } catch (err) {
      console.log(err);
    }
  }
);


// CREATE BLOG
router.post(
  "/blogs",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        slug,
        category,
        author,
        short_description,
        content,
        publish_date,
        is_featured,
        seo_title,
        seo_description,
        seo_keywords
      } = req.body;

      const image =
        req.file
          ? `/uploads/${req.file.filename}`
          : null;

      await db.query(
        `
        INSERT INTO blogs (
          title,
          slug,
          category,
          author,
          short_description,
          content,
          publish_date,
          is_featured,
          image,
          seo_title,
          seo_description,
          seo_keywords
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          title,
          slug,
          category,
          author,
          short_description,
          content,
          publish_date,
          is_featured,
          image,
          seo_title,
          seo_description,
          seo_keywords
        ]
      );

      res.json({
        msg:
          "Blog created successfully"
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        msg:
          "Blog creation failed"
      });
    }
  }
);


// UPDATE BLOG
router.put(
  "/blogs/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        slug,
        category,
        author,
        short_description,
        content,
        publish_date,
        is_featured,
        seo_title,
        seo_description,
        seo_keywords
      } = req.body;

      const image =
        req.file
          ? `/uploads/${req.file.filename}`
          : null;

      await db.query(
        `
        UPDATE blogs
        SET
          title=?,
          slug=?,
          category=?,
          author=?,
          short_description=?,
          content=?,
          publish_date=?,
          is_featured=?,
          image=COALESCE(?, image),
          seo_title=?,
          seo_description=?,
          seo_keywords=?
        WHERE id=?
      `,
        [
          title,
          slug,
          category,
          author,
          short_description,
          content,
          publish_date,
          is_featured,
          image,
          seo_title,
          seo_description,
          seo_keywords,
          req.params.id
        ]
      );

      res.json({
        msg:
          "Blog updated successfully"
      });

    } catch (err) {
      console.log(err);
    }
  }
);


// DELETE BLOG
router.delete(
  "/blogs/:id",
  async (req, res) => {
    try {
      await db.query(
        `
        DELETE FROM blogs
        WHERE id=?
      `,
        [req.params.id]
      );

      res.json({
        msg:
          "Blog deleted successfully"
      });

    } catch (err) {
      console.log(err);
    }
  }
);

export default router;