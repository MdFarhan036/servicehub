import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../config/db.js";

import {
  verifyAdminToken,adminOnly
} from "../middleware/authMiddleware.js";


const router = express.Router();


/*
==========================================
REGISTER NORMAL USER
==========================================

IMPORTANT:
This route creates only normal users.
It should not create admin or technician accounts.
*/

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        phone,
        city
      } = req.body;


      /*
      VALIDATION
      */

      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Name, email and password are required"

        });

      }


      /*
      CHECK EXISTING USER
      */

      const [existing] =
        await db.query(
          `
          SELECT id
          FROM users
          WHERE email = ?
          `,
          [email]
        );


      if (existing.length) {

        return res.status(400).json({

          success: false,

          msg:
            "Email already exists"

        });

      }


      /*
      HASH PASSWORD
      */

      const hashed =
        await bcrypt.hash(
          password,
          10
        );


      /*
      CREATE NORMAL USER
      */

      await db.query(
        `
        INSERT INTO users
        (
          name,
          email,
          phone,
          city,
          password,
          role,
          status
        )
        VALUES
        (?, ?, ?, ?, ?, 'user', 'active')
        `,
        [
          name,
          email,
          phone || null,
          city || null,
          hashed
        ]
      );


      return res.status(201).json({

        success: true,

        msg:
          "Registration successful"

      });

    } catch (err) {

      console.error(
        "Registration error:",
        err
      );


      return res.status(500).json({

        success: false,

        msg:
          "Registration failed"

      });

    }

  }
);


/*
==========================================
ADMIN LOGIN
POST /api/auth/login
==========================================

ONLY ADMIN CAN LOGIN HERE.
*/

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      /*
      VALIDATION
      */

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Email and password are required"

        });

      }


      /*
      FIND USER
      */

      const [rows] =
        await db.query(
          `
          SELECT *
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [email]
        );


      if (
        rows.length === 0
      ) {

        return res.status(401).json({

          success: false,

          msg:
            "Invalid email or password"

        });

      }


      const user =
        rows[0];


      /*
      IMPORTANT:
      THIS LOGIN ROUTE IS ONLY
      FOR ADMIN PANEL
      */

      if (
        user.role !== "admin"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Admin access only"

        });

      }


      /*
      CHECK ACCOUNT STATUS
      */

      if (
        user.status &&
        user.status !== "active"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Your account is inactive"

        });

      }


      /*
      VERIFY PASSWORD
      */

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );


      if (!isMatch) {

        return res.status(401).json({

          success: false,

          msg:
            "Invalid email or password"

        });

      }


      /*
      CREATE ADMIN JWT
      */

      const token =
        jwt.sign(

          {

            id:
              user.id,

            role:
              user.role

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              "7d"

          }

        );


      /*
      =====================================
      STORE ADMIN TOKEN

      IMPORTANT:
      DO NOT USE GENERIC "token".

      Technician:
      technician_token

      Client:
      client_token

      Admin:
      admin_token
      =====================================
      */

      res.cookie(
        "admin_token",
        token,
        {

          httpOnly:
            true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:
            "lax",

          maxAge:
            7 *
            24 *
            60 *
            60 *
            1000

        }
      );


      /*
      SEND SAFE ADMIN DATA
      */

      return res.status(200).json({

        success:
          true,

        msg:
          "Admin login successful",

        user: {

          id:
            user.id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role

        }

      });

    } catch (err) {

      console.error(
        "Admin login error:",
        err
      );


      return res.status(500).json({

        success: false,

        msg:
          "Login failed"

      });

    }

  }
);


/*
==========================================
GET CURRENT ADMIN
GET /api/auth/me
==========================================
*/

router.get(
  "/me",

  verifyAdminToken,
  async (
    req,
    res
  ) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            role,
            status
          FROM users
          WHERE id = ?
          LIMIT 1
          `,
          [
            req.user.id
          ]
        );


      if (
        rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          msg:
            "User not found"

        });

      }


      const user =
        rows[0];


      /*
      SECURITY:
      ONLY ADMIN SHOULD ACCESS
      ADMIN AUTH ENDPOINT
      */

      if (
        user.role !== "admin"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Admin access required"

        });

      }


      /*
      CHECK ACCOUNT STATUS
      */

      if (
        user.status &&
        user.status !== "active"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Account is inactive"

        });

      }


      return res.status(200).json({

        success:
          true,

        user: {

          id:
            user.id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          status:
            user.status

        }

      });

    } catch (err) {

      console.error(
        "Get current admin error:",
        err
      );


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch admin"

      });

    }

  }
);


/*
==========================================
ADMIN LOGOUT
POST /api/auth/logout
==========================================
*/

router.post(
  "/logout",

  (
    req,
    res
  ) => {

    /*
    IMPORTANT:
    CLEAR ONLY ADMIN COOKIE
    */

    res.clearCookie(
      "admin_token",
      {

        httpOnly:
          true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          "lax"

      }
    );


    return res.status(200).json({

      success:
        true,

      msg:
        "Admin logged out successfully"

    });

  }
);


export default router;