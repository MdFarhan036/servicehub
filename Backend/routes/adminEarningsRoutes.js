import express from "express";

import {
  getAdminEarningsSummary,
  getTechnicianEarningsReport,
  getAdminEarningsHistory,
} from "../controllers/adminEarningsController.js";

import {
  verifyAdminToken,
  adminOnly,
} from "../middleware/authMiddleware.js";


const router =
  express.Router();


router.get(
  "/summary",
  verifyAdminToken,
  adminOnly,
  getAdminEarningsSummary
);


router.get(
  "/technicians",
  verifyAdminToken,
  adminOnly,
  getTechnicianEarningsReport
);


router.get(
  "/history",
  verifyAdminToken,
  adminOnly,
  getAdminEarningsHistory
);


export default router;