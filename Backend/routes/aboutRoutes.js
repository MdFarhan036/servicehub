import express from "express";
import upload from "../middleware/upload.js";
import {
  getAbout,
  upsertAbout
} from "../controllers/aboutController.js";

const router = express.Router();

/* MUST MATCH FRONTEND FILE INPUT NAMES */
const multiUpload = upload.fields([
  {
    name: "hero_image",
    maxCount: 1
  },
  {
    name: "intro_image",
    maxCount: 1
  }
]);

router.get("/about", getAbout);

router.put(
  "/about",
  multiUpload,
  upsertAbout
);

export default router;