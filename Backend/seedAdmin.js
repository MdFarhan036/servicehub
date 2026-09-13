import bcrypt from "bcryptjs";
import { db } from "./config/db.js";

const seedAdmin = async () => {
  try {
    const name = "Admin";
    const email = "admin@gmail.com";
    const password = "admin123";

    // check if already exists
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert admin
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"]
    );

    console.log("✅ Admin seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();