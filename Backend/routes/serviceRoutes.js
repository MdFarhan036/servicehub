import express from "express";
import { db } from "../config/db.js";
import { verifyAdminToken, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();
// CREATE SERVICE (MULTIPLE IMAGES)
router.post(
  "/",
  verifyAdminToken, adminOnly,
  upload.array("images", 5), // max 5 images
  async (req, res) => {
   // CREATE
const { title, price, category_id, description } = req.body;


    try {
      const imagePaths = req.files.map(
        (file) => "/uploads/" + file.filename
      );

    
await db.query(
  "INSERT INTO services (title, price, category_id, images, description) VALUES (?, ?, ?, ?, ?)",
  [title, price, category_id, JSON.stringify(imagePaths), description]
);

      res.json({ msg: "Service added" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error adding service" });
    }
  }
);
// UPDATE SERVICE (🔥 REQUIRED)
router.put(
  "/:id",
  verifyAdminToken, adminOnly,
  upload.array("images", 5), // for multiple images
  async (req, res) => {
    try {
      const { title, price, category_id, description } = req.body;

      // existing images (from frontend)
    let existingImages = [];

try {
  existingImages = JSON.parse(req.body.image_urls || "[]");
} catch (e) {
  existingImages = [];
}

      // new uploaded images
    const newImages = req.files
  ? req.files.map((file) => "/uploads/" + file.filename)
  : [];

      const finalImages = [...existingImages, ...newImages];

      await db.query(
        `UPDATE services 
         SET title=?, price=?, category_id=?, description=?, images=? 
         WHERE id=?`,
        [
          title,
          price,
          category_id,
          description,
          JSON.stringify(finalImages),
          req.params.id,
        ]
      );

      res.json({ msg: "Service updated" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Update failed" });
    }
  }
);
router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT s.*, c.name as category_name
    FROM services s
    LEFT JOIN categories c
    ON s.category_id = c.id
  `);

  const formatted = rows.map((s) => ({
    ...s,
    images: s.images ? JSON.parse(s.images) : [],
  }));

  res.json(formatted);
});

// Delete
router.delete(
  "/:id/image",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({
          msg: "Image path is required",
        });
      }

      const [[service]] = await db.query(
        "SELECT images FROM services WHERE id=?",
        [req.params.id]
      );

      if (!service) {
        return res.status(404).json({
          msg: "Service not found",
        });
      }

      let images = [];

      try {
        images = service.images
          ? JSON.parse(service.images)
          : [];
      } catch (err) {
        images = [];
      }

      // Remove selected image
      const updatedImages = images.filter(
        (img) => img !== image
      );

      // Update database
      await db.query(
        "UPDATE services SET images=? WHERE id=?",
        [
          JSON.stringify(updatedImages),
          req.params.id,
        ]
      );

      // Optional: delete physical file
      // Only if image belongs to /uploads/
      if (image.startsWith("/uploads/")) {
        const fs = await import("fs");
        const path = await import("path");

        const filePath = path.join(
          process.cwd(),
          image
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.json({
        success: true,
        msg: "Image deleted successfully",
        images: updatedImages,
      });

    } catch (err) {
      console.error(
        "Delete image error:",
        err
      );

      res.status(500).json({
        msg: "Failed to delete image",
      });
    }
  }
);

router.patch("/:id/popular", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const { is_popular } = req.body;

    await db.query(
      "UPDATE services SET is_popular=? WHERE id=?",
      [is_popular ? 1 : 0, req.params.id]
    );

    res.json({
      success: true,
      msg: "Popular service updated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to update popular service"
    });
  }
});
router.patch("/:id/dailydeal", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const {
      is_daily_deal,
      daily_deal_price
    } = req.body;

    await db.query(
      `UPDATE services 
       SET is_daily_deal=?,
           daily_deal_price=?
       WHERE id=?`,
      [
        is_daily_deal ? 1 : 0,
        daily_deal_price || null,
        req.params.id
      ]
    );

    res.json({
      success: true,
      msg: "Daily deal updated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to update daily deal"
    });
  }
});
router.get("/popular/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM services WHERE is_popular=1"
    );

    const formatted = rows.map((s) => ({
      ...s,
      images: s.images
        ? JSON.parse(s.images)
        : []
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to fetch popular services"
    });
  }
});
router.get("/daily-deals/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM services 
       WHERE is_daily_deal=1`
    );

    const formatted = rows.map((s) => ({
      ...s,
      images: s.images
        ? JSON.parse(s.images)
        : []
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to fetch daily deals"
    });
  }
});
router.get("/:id", async (req, res) => {
  const [[service]] = await db.query(
    "SELECT * FROM services WHERE id=?",
    [req.params.id]
  );

  if (!service) return res.status(404).json({ msg: "Not found" });

  service.images = service.images ? JSON.parse(service.images) : [];

  res.json(service);
});
export default router;