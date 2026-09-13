import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../config/db.js";

import {
  verifyTechnicianToken
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
==========================================
TECHNICIAN LOGIN
POST /api/technicians/login
==========================================

ONLY TECHNICIANS CAN LOGIN HERE.
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


      /*
      USER NOT FOUND
      */

      if (
        rows.length === 0
      ) {

        return res.status(401).json({

          success: false,

          msg:
            "Invalid email or password"

        });

      }


      const technician =
        rows[0];


      /*
      IMPORTANT:
      ONLY TECHNICIAN CAN LOGIN
      */

      if (
        technician.role !==
        "technician"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Technician access only"

        });

      }


      /*
      CHECK ACCOUNT STATUS
      */

      if (
        technician.status &&
        technician.status !== "active"
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
          technician.password
        );


      if (
        !isMatch
      ) {

        return res.status(401).json({

          success: false,

          msg:
            "Invalid email or password"

        });

      }


      /*
      CREATE TECHNICIAN JWT
      */

      const token =
        jwt.sign(

          {

            id:
              technician.id,

            role:
              technician.role

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              "7d"

          }

        );


      /*
      =====================================
      STORE TECHNICIAN TOKEN

      ADMIN:
      admin_token

      TECHNICIAN:
      technician_token

      CLIENT:
      client_token
      =====================================
      */

      res.cookie(
        "technician_token",
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
      SEND SAFE TECHNICIAN DATA
      */

      return res.status(200).json({

        success:
          true,

        msg:
          "Technician login successful",

        technician: {

          id:
            technician.id,

          name:
            technician.name,

          email:
            technician.email,

          role:
            technician.role

        }

      });

    } catch (error) {

      console.error(
        "Technician login error:",
        error
      );


      return res.status(500).json({

        success:
          false,

        msg:
          "Technician login failed"

      });

    }

  }
);


/*
==========================================
GET CURRENT TECHNICIAN
GET /api/technicians/check-auth
==========================================
*/

router.get(
  "/check-auth",

  verifyTechnicianToken,

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


      /*
      TECHNICIAN NOT FOUND
      */

      if (
        rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          msg:
            "Technician not found"

        });

      }


      const technician =
        rows[0];


      /*
      SECURITY:
      DOUBLE CHECK ROLE
      */

      if (
        technician.role !==
        "technician"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Technician access required"

        });

      }


      /*
      CHECK STATUS
      */

      if (
        technician.status &&
        technician.status !==
        "active"
      ) {

        return res.status(403).json({

          success: false,

          msg:
            "Technician account is inactive"

        });

      }


      return res.status(200).json({

        success:
          true,

        technician: {

          id:
            technician.id,

          name:
            technician.name,

          email:
            technician.email,

          role:
            technician.role,

          status:
            technician.status

        }

      });

    } catch (error) {

      console.error(
        "Check technician auth error:",
        error
      );


      return res.status(500).json({

        success:
          false,

        msg:
          "Failed to check technician authentication"

      });

    }

  }
);


/*
==========================================
TECHNICIAN LOGOUT
POST /api/technicians/logout
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
    CLEAR ONLY TECHNICIAN COOKIE
    */

    res.clearCookie(
      "technician_token",
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
        "Technician logged out successfully"

    });

  }
);


export default router;