import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../config/db.js";

import {
  verifyTechnicianToken,
  verifyAdminToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/* =====================================================
   TECHNICIAN LOGIN
===================================================== */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;


    if (!email || !password) {

      return res.status(400).json({
        success: false,
        msg: "Email and password are required"
      });

    }


    const [rows] = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      AND role = 'technician'
      LIMIT 1
      `,
      [email]
    );


    if (!rows.length) {

      return res.status(401).json({
        success: false,
        msg: "Invalid email or password"
      });

    }


    const technician = rows[0];


    /*
    CHECK TECHNICIAN STATUS
    */

    if (
      technician.status &&
      technician.status !== "active"
    ) {

      return res.status(403).json({
        success: false,
        msg: "Technician account is inactive"
      });

    }


    const validPassword =
      await bcrypt.compare(
        password,
        technician.password
      );


    if (!validPassword) {

      return res.status(401).json({
        success: false,
        msg: "Invalid email or password"
      });

    }


    /*
    CREATE TECHNICIAN TOKEN
    */

    const token = jwt.sign(
      {
        id: technician.id,
        email: technician.email,
        role: technician.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    /*
    IMPORTANT

    ADMIN      → admin_token
    TECHNICIAN → technician_token
    CLIENT     → client_token
    */

    res.cookie(
      "technician_token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000
      }
    );


    return res.status(200).json({

      success: true,

      msg:
        "Technician login successful",

      technician: {

        id:
          technician.id,

        name:
          technician.name,

        email:
          technician.email,

        phone:
          technician.phone,

        city:
          technician.city,

        specialization:
          technician.specialization,

        experience:
          technician.experience,

        role:
          technician.role,

        status:
          technician.status

      }

    });

  } catch (err) {

    console.error(
      "Technician login error:",
      err
    );


    return res.status(500).json({

      success: false,

      msg:
        "Technician login failed"

    });

  }

});


/* =====================================================
   CHECK TECHNICIAN AUTH
===================================================== */

router.get(
  "/check-auth",

  verifyTechnicianToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            phone,
            city,
            specialization,
            experience,
            role,
            status
          FROM users
          WHERE id = ?
          AND role = 'technician'
          LIMIT 1
          `,
          [
            req.user.id
          ]
        );


      if (!rows.length) {

        return res.status(404).json({

          success: false,

          authenticated: false,

          msg:
            "Technician not found"

        });

      }


      const technician =
        rows[0];


      /*
      CHECK STATUS
      */

      if (
        technician.status &&
        technician.status !== "active"
      ) {

        return res.status(403).json({

          success: false,

          authenticated: false,

          msg:
            "Technician account is inactive"

        });

      }


      return res.status(200).json({

        success: true,

        authenticated: true,

        technician

      });

    } catch (err) {

      console.error(
        "Check technician auth error:",
        err
      );


      return res.status(500).json({

        success: false,

        authenticated: false,

        msg:
          "Failed to check technician authentication"

      });

    }

  }
);


/* =====================================================
   TECHNICIAN LOGOUT
===================================================== */

router.post(
  "/logout",

  (req, res) => {

    /*
    CLEAR ONLY TECHNICIAN COOKIE
    */

    res.clearCookie(
      "technician_token",
      {

        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          "lax"

      }
    );


    return res.status(200).json({

      success: true,

      msg:
        "Technician logged out successfully"

    });

  }
);


/* =====================================================
   GET ALL TECHNICIANS
   ADMIN ONLY
===================================================== */

router.get(
  "/",

  verifyAdminToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            phone,
            city,
            specialization,
            experience,
            role,
            status,
            created_at
          FROM users
          WHERE role = 'technician'
          ORDER BY id DESC
          `
        );


      return res.json(rows);

    } catch (err) {

      console.error(err);


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch technicians"

      });

    }

  }
);


/* =====================================================
   GET SINGLE TECHNICIAN
   ADMIN ONLY
===================================================== */

router.get(
  "/:id",

  verifyAdminToken,

  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            phone,
            city,
            specialization,
            experience,
            role,
            status,
            created_at
          FROM users
          WHERE id = ?
          AND role = 'technician'
          LIMIT 1
          `,
          [
            req.params.id
          ]
        );


      if (!rows.length) {

        return res.status(404).json({

          success: false,

          msg:
            "Technician not found"

        });

      }


      return res.json(
        rows[0]
      );

    } catch (err) {

      console.error(err);


      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch technician"

      });

    }

  }
);


/* =====================================================
   ADD TECHNICIAN
   ADMIN ONLY
===================================================== */

router.post(
  "/",

  verifyAdminToken,

  async (req, res) => {

    try {

      const {

        name,
        email,
        phone,
        password,
        specialization,
        experience,
        city

      } = req.body;


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


      const [existing] =
        await db.query(
          `
          SELECT id
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [email]
        );


      if (existing.length) {

        return res.status(409).json({

          success: false,

          msg:
            "Email already exists"

        });

      }


      const hashed =
        await bcrypt.hash(
          password,
          10
        );


      await db.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          role,
          phone,
          city,
          specialization,
          experience,
          status
        )
        VALUES
        (
          ?,
          ?,
          ?,
          'technician',
          ?,
          ?,
          ?,
          ?,
          'active'
        )
        `,
        [

          name,
          email,
          hashed,
          phone || null,
          city || null,
          specialization || null,
          experience || null

        ]
      );


      return res.status(201).json({

        success: true,

        msg:
          "Technician added successfully"

      });

    } catch (err) {

      console.error(err);


      return res.status(500).json({

        success: false,

        msg:
          "Failed to add technician"

      });

    }

  }
);


/* =====================================================
   UPDATE TECHNICIAN
   ADMIN ONLY
===================================================== */

router.put(
  "/:id",

  verifyAdminToken,

  async (req, res) => {

    try {

      const {

        name,
        email,
        phone,
        specialization,
        experience,
        city,
        status

      } = req.body;


      await db.query(
        `
        UPDATE users
        SET
          name = ?,
          email = ?,
          phone = ?,
          specialization = ?,
          experience = ?,
          city = ?,
          status = ?
        WHERE id = ?
        AND role = 'technician'
        `,
        [

          name,
          email,
          phone,
          specialization,
          experience,
          city,
          status,
          req.params.id

        ]
      );


      return res.json({

        success: true,

        msg:
          "Technician updated"

      });

    } catch (err) {

      console.error(err);


      return res.status(500).json({

        success: false,

        msg:
          "Failed to update technician"

      });

    }

  }
);


/* =====================================================
   DELETE TECHNICIAN
   ADMIN ONLY
===================================================== */

router.delete(
  "/:id",

  verifyAdminToken,

  async (req, res) => {

    try {

      await db.query(
        `
        DELETE FROM users
        WHERE id = ?
        AND role = 'technician'
        `,
        [
          req.params.id
        ]
      );


      return res.json({

        success: true,

        msg:
          "Technician deleted"

      });

    } catch (err) {

      console.error(err);


      return res.status(500).json({

        success: false,

        msg:
          "Failed to delete technician"

      });

    }

  }
);


export default router;