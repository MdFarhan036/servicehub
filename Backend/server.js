import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

/* ================= ROUTES ================= */

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

import technicianRoutes from "./routes/technicianRoutes.js";
import technicianAuthRoutes from
  "./routes/technicianAuthRoutes.js";

import blogRoutes from "./routes/blogRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";

import contactRoutes from "./routes/contactRoutes.js";

import notificationRoutes from
  "./routes/notificationRoutes.js";

import technicianNotificationsRoutes from
  "./routes/technicianNotifications.js";

import chatbotRoutes from "./routes/chatbotRoutes.js";

import walletRoutes from "./routes/walletRoutes.js";

import adminEarningsRoutes from
  "./routes/adminEarningsRoutes.js";

import technicianCommissionRoutes from
  "./routes/technicianCommissionRoutes.js";

import technicianWithdrawalsRoutes from
  "./routes/technicianWithdrawals.js";

import adminWithdrawalRoutes from
  "./routes/adminWithdrawals.js";


/* ================= ENV ================= */

dotenv.config();


/* ================= APP ================= */

const app = express();


/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176"
    ],

    credentials: true
  })
);


/* ================= MIDDLEWARE ================= */

app.use(express.json());

app.use(cookieParser());


/* ================= STATIC FILES ================= */

app.use(
  "/uploads",
  express.static("uploads")
);


/* ================= AUTH ================= */

app.use(
  "/api/auth",
  authRoutes
);


/* ================= USERS ================= */

app.use(
  "/api/users",
  userRoutes
);


/* ================= CATEGORIES ================= */

app.use(
  "/api/categories",
  categoryRoutes
);


/* ================= SERVICES ================= */

app.use(
  "/api/services",
  serviceRoutes
);


/* ================= BOOKINGS ================= */

app.use(
  "/api/bookings",
  bookingRoutes
);


/* ================= COMMENTS ================= */

app.use(
  "/api/comments",
  commentRoutes
);


/* ================= ADMIN ================= */

app.use(
  "/api/admin",
  adminRoutes
);


/* ================= FAQS ================= */

app.use(
  "/api/faqs",
  faqRoutes
);


/* ================= TECHNICIANS ================= */

/*
Technician management routes
*/

app.use(
  "/api/technicians",
  technicianRoutes
);


/*
Technician authentication routes

Examples:
POST /api/technicians/login
POST /api/technicians/logout
GET  /api/technicians/check-auth
*/

app.use(
  "/api/technicians",
  technicianAuthRoutes
);


/* ================= BLOGS ================= */

app.use(
  "/api/blogs",
  blogRoutes
);


/* ================= ADMIN BLOGS ================= */

app.use(
  "/api/admin",
  adminBlogRoutes
);


/* ================= CONTACT ================= */

app.use(
  "/api/contact",
  contactRoutes
);


/* ================= ADMIN NOTIFICATIONS ================= */

app.use(
  "/api/notifications",
  notificationRoutes
);


/* ================= TECHNICIAN NOTIFICATIONS ================= */

app.use(
  "/api/technician-notifications",
  technicianNotificationsRoutes
);


/* ================= WALLET ================= */

app.use(
  "/api/wallet",
  walletRoutes
);


/* ================= ADMIN EARNINGS ================= */

app.use(
  "/api/admin/earnings",
  adminEarningsRoutes
);


/* ================= TECHNICIAN COMMISSIONS ================= */

app.use(
  "/api/admin/technician-commissions",
  technicianCommissionRoutes
);


/* ================= TECHNICIAN WITHDRAWALS ================= */

app.use(
  "/api/technician-withdrawals",
  technicianWithdrawalsRoutes
);


/* ================= ADMIN WITHDRAWALS ================= */

app.use(
  "/api/admin/withdrawals",
  adminWithdrawalRoutes
);


/* ================= CHATBOT ================= */

app.use(
  "/api/chatbot",
  chatbotRoutes
);


/* ================= SERVER ================= */

app.listen(
  process.env.PORT,
  () => {

    console.log(
      `Server running on ${process.env.PORT}`
    );

  }
);