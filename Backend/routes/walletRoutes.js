import express from "express";

import {
getMyWallet,
getMyTransactions,
} from "../controllers/walletController.js";

import {
verifyAdminToken, verifyTechnicianToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
GET MY WALLET
*/
router.get(
"/my-wallet",
verifyAdminToken, verifyTechnicianToken,
getMyWallet
);

/*
GET WALLET TRANSACTIONS
*/
router.get(
"/transactions",
verifyAdminToken, verifyTechnicianToken,
getMyTransactions
);

export default router;
