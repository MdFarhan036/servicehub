import express from "express";
import { db } from "../config/db.js";
import { verifyAdminToken, adminOnly } from "../middleware/authMiddleware.js";
import { slugify } from "../utils/slugify.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= CREATE ================= */
router.post(
  "/",
  verifyAdminToken, adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        slug,
        description,
        meta_title,
        meta_description,
        meta_keywords,
        canonical_url
      } = req.body;

      const image =
        req.file
          ? `/uploads/${req.file.filename}`
          : null;

      await db.query(
        `
        INSERT INTO categories 
        (
          name,
          slug,
          image,
          description,
          meta_title,
          meta_description,
          meta_keywords,
          canonical_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          name,
          slug,
          image,
          description,
          meta_title,
          meta_description,
          meta_keywords,
          canonical_url
        ]
      );

      res.json({
        msg:
          "Category created successfully"
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg:
          "Failed to create category"
      });
    }
  }
);

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Failed to fetch categories"
    });
  }
});

/* ================= GET ONE ================= */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE id=?",
      [req.params.id]
    );

    res.json(rows[0] || null);
  } catch {
    res.status(500).json({ msg: "Fetch failed" });
  }
});

/* ================= GET BY SLUG ================= */
router.get("/slug/:slug", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE slug=?",
      [req.params.slug]
    );

    if (!rows[0]) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(rows[0]);
  } catch {
    res.status(500).json({ msg: "Fetch failed" });
  }
});

/* ================= UPDATE ================= */
router.put(
  "/:id",
  verifyAdminToken, adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        slug,
        description,
        meta_title,
        meta_description,
        meta_keywords,
        canonical_url
      } = req.body;

      const [[existing]] =
        await db.query(
          "SELECT image FROM categories WHERE id=?",
          [req.params.id]
        );

      const image =
        req.file
          ? `/uploads/${req.file.filename}`
          : existing.image;

      await db.query(
        `
        UPDATE categories
        SET 
          name=?,
          slug=?,
          image=?,
          description=?,
          meta_title=?,
          meta_description=?,
          meta_keywords=?,
          canonical_url=?
        WHERE id=?
      `,
        [
          name,
          slug,
          image,
          description,
          meta_title,
          meta_description,
          meta_keywords,
          canonical_url,
          req.params.id
        ]
      );

      res.json({
        msg:
          "Category updated successfully"
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg:
          "Failed to update category"
      });
    }
  }
);

/* ================= DELETE ================= */
router.delete("/:id", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM categories WHERE id=?",
      [req.params.id]
    );

    res.json({ msg: "Category deleted successfully" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
});

export default router;