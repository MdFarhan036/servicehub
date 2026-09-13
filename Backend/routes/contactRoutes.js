// routes/contact.js
import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await db.query(
      `INSERT INTO contacts (name, email, phone, message)
       VALUES (?, ?, ?, ?)`,
      [name, email, phone, message]
    );

    res.json({ msg: "Message saved" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
});
router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT * FROM contacts ORDER BY id DESC
  `);

  res.json(rows);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await db.query(
    "DELETE FROM contacts WHERE id = ?",
    [id]
  );

  res.json({ msg: "Deleted" });
});
export default router;