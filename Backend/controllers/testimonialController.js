import { db } from "../config/db.js";

/* ================= TESTIMONIAL CRUD ================= */

// GET ALL
export const getTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM testimonials ORDER BY sort_order ASC"
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

// GET ONE
export const getTestimonial = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM testimonials WHERE id=?",
      [req.params.id]
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch testimonial" });
  }
};

// CREATE
export const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      designation,
      organization,
      message,
      sort_order,
      is_active,
      seo_title,
      seo_description,
      seo_keywords
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    await db.query(
      `INSERT INTO testimonials 
      (
        name,
        designation,
        organization,
        message,
        image,
        sort_order,
        is_active,
        seo_title,
        seo_description,
        seo_keywords
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        designation,
        organization,
        message,
        image,
        sort_order,
        is_active,
        seo_title,
        seo_description,
        seo_keywords
      ]
    );

    res.json({ message: "Created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Create failed" });
  }
};

// UPDATE
export const updateTestimonial = async (req, res) => {
  try {
    const {
      name,
      designation,
      organization,
      message,
      sort_order,
      is_active,
      seo_title,
      seo_description,
      seo_keywords
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    await db.query(
      `UPDATE testimonials SET
        name=?,
        designation=?,
        organization=?,
        message=?,
        sort_order=?,
        is_active=?,
        seo_title=?,
        seo_description=?,
        seo_keywords=?,
        image = COALESCE(?, image)
      WHERE id=?`,
      [
        name,
        designation,
        organization,
        message,
        sort_order,
        is_active,
        seo_title,
        seo_description,
        seo_keywords,
        image,
        req.params.id
      ]
    );

    res.json({ message: "Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE
export const deleteTestimonial = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM testimonials WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Delete failed" });
  }
};


/* ================= PAGE SETTINGS ================= */

// GET PAGE
export const getTestimonialsPage = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM testimonials_page LIMIT 1"
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch page settings" });
  }
};

// UPDATE PAGE
export const updateTestimonialsPage = async (req, res) => {
  try {
    const {
      hero_title,
      hero_subtitle
    } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM testimonials_page LIMIT 1"
    );

    if (rows.length > 0) {
      await db.query(
        `UPDATE testimonials_page SET
          hero_title=?,
          hero_subtitle=?
        WHERE id=?`,
        [
          hero_title,
          hero_subtitle,
          rows[0].id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO testimonials_page
        (hero_title, hero_subtitle)
        VALUES (?, ?)`,
        [
          hero_title,
          hero_subtitle
        ]
      );
    }

    res.json({ message: "Page updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Page update failed" });
  }
};