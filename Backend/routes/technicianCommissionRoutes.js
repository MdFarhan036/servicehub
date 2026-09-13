import express from "express";

import {

  getTechnicianCommissions,

  updateTechnicianCommission,

  resetTechnicianCommission,

} from "../controllers/technicianCommissionController.js";


import {

  verifyAdminToken,

  adminOnly,

} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
GET ALL TECHNICIANS
*/

router.get(
  "/",
  verifyAdminToken,
  adminOnly,
  getTechnicianCommissions
);


/*
SET CUSTOM COMMISSION
*/

router.put(
  "/:id",
  verifyAdminToken,
  adminOnly,
  updateTechnicianCommission
);


/*
RESET TO DEFAULT COMMISSION
*/

router.delete(
  "/:id",
  verifyAdminToken,
  adminOnly,
  resetTechnicianCommission
);


export default router;