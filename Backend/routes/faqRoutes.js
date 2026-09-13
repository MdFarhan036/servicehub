import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM faqs ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch FAQs" });
  }
});

/* ================= GET SINGLE ================= */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM faqs WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "FAQ not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching FAQ" });
  }
});

/* ================= CREATE ================= */
router.post("/", async (req, res) => {
  const { question, answer } = req.body;

  try {
    await db.query(
      "INSERT INTO faqs (question, answer) VALUES (?, ?)",
      [question, answer]
    );
    res.json({ msg: "FAQ added" });
  } catch (err) {
    res.status(500).json({ msg: "Error adding FAQ" });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", async (req, res) => {
  const { question, answer } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE faqs SET question = ?, answer = ? WHERE id = ?",
      [question, answer, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "FAQ not found" });
    }

    res.json({ msg: "FAQ updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating FAQ" });
  }
});

/* ================= DELETE (OPTIONAL) ================= */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM faqs WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "FAQ not found" });
    }

    res.json({ msg: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting FAQ" });
  }
});

export default router;