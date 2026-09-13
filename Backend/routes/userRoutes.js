import express from "express";
import { db } from "../config/db.js";
import { verifyAdminToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET ALL USERS */
router.get("/", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const { role } = req.query;

    let query =
      "SELECT * FROM users";

    let values = [];

    if (role) {
      query +=
        " WHERE role=?";
      values.push(role);
    }

    query +=
      " ORDER BY id DESC";

    const [rows] =
      await db.query(
        query,
        values
      );

    res.json(rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg:
        "Failed to fetch users"
    });
  }
});

router.put("/:id", verifyAdminToken, adminOnly, async (req, res) => {
  const { name, email } = req.body;

  await db.query(
    "UPDATE users SET name=?, email=? WHERE id=?",
    [name, email, req.params.id]
  );

  res.json({
    msg: "User updated"
  });
});
router.put(
  "/:id/reset-password",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    const { password } =
      req.body;

    const hashed =
      await bcrypt.hash(
        password,
        10
      );

    await db.query(
      `UPDATE users 
       SET password=? 
       WHERE id=?`,
      [
        hashed,
        req.params.id
      ]
    );

    res.json({
      msg:
        "Password reset successful"
    });
  }
);
router.get("/:id", verifyAdminToken, adminOnly, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id=?",
    [req.params.id]
  );

  res.json(rows[0]);
});
/* DELETE USER */
router.delete("/:id", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM users WHERE id=?",
      [req.params.id]
    );

    res.json({
      msg: "User deleted"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Delete failed"
    });
  }
});

export default router;