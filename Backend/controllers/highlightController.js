import { db } from "../config/db.js";

/* ================= GET ALL ================= */
export const getHighlights = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM highlights ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch highlights" });
  }
};

/* ================= GET ONE ================= */
export const getHighlightById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM highlights WHERE id=?",
      [req.params.id]
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch highlight" });
  }
};

/* ================= CREATE ================= */
export const createHighlight = async (req, res) => {
  try {
    const { label, value, is_active } = req.body;

    if (!label || value === "") {
      return res.status(400).json({ message: "All fields required" });
    }

    await db.query(
      "INSERT INTO highlights (label, value, is_active) VALUES (?, ?, ?)",
      [label, value, is_active ?? 1]
    );

    res.json({ message: "Highlight created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

/* ================= UPDATE ================= */
export const updateHighlight = async (req, res) => {
  try {
    const { label, value, is_active } = req.body;

    await db.query(
      "UPDATE highlights SET label=?, value=?, is_active=? WHERE id=?",
      [label, value, is_active, req.params.id]
    );

    res.json({ message: "Highlight updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE ================= */
export const deleteHighlight = async (req, res) => {
  try {
    await db.query("DELETE FROM highlights WHERE id=?", [
      req.params.id
    ]);

    res.json({ message: "Highlight deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};