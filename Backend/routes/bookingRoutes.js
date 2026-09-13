
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { verifyAdminToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   TECHNICIAN LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required"
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        phone,
        city,
        specialization,
        experience,
        status
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        msg: "Invalid email or password"
      });
    }

    const technician = rows[0];

    /* Only active technicians */
    if (technician.status !== "active") {
      return res.status(403).json({
        msg: "Your account is inactive"
      });
    }

    /* Technician must have specialization */
    if (!technician.specialization) {
      return res.status(403).json({
        msg: "This account is not a technician account"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      technician.password
    );

    if (!isMatch) {
      return res.status(401).json({
        msg: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: technician.id,
        role: "technician"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      msg: "Technician login successful",
      technician: {
        id: technician.id,
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        city: technician.city,
        specialization: technician.specialization,
        experience: technician.experience,
        status: technician.status
      }
    });

  } catch (err) {
    console.error("Technician login error:", err);

    res.status(500).json({
      msg: "Technician login failed"
    });
  }
});
router.post("/", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const {
      service_id,
      booking_date,
      booking_time,
      address,
      notes
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !service_id ||
      !booking_date ||
      !booking_time ||
      !address
    ) {
      return res.status(400).json({
        msg: "Service, date, time and address are required"
      });
    }

    const userId = req.user.id;


    /* =========================
       GET USER
    ========================= */

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        city
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        msg: "User profile not found"
      });
    }

    const user = users[0];


    /* =========================
       PHONE REQUIRED
    ========================= */

    if (!user.phone) {
      return res.status(400).json({
        msg: "Please add your phone number in your profile before booking"
      });
    }


    /* =========================
       GET SERVICE
    ========================= */

    const [services] = await db.query(
      `
      SELECT
        id,
        title,
        price,
        is_daily_deal,
        daily_deal_price
      FROM services
      WHERE id = ?
      LIMIT 1
      `,
      [service_id]
    );

    if (!services.length) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    const service = services[0];


    /* =========================
       CALCULATE BOOKING AMOUNT
    ========================= */

    let amount = Number(service.price);

    /*
      If this service is currently a daily deal
      and a valid deal price exists, use that price.
    */

    if (
      Number(service.is_daily_deal) === 1 &&
      service.daily_deal_price !== null
    ) {
      amount = Number(service.daily_deal_price);
    }


    /* =========================
       VALIDATE PRICE
    ========================= */

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return res.status(400).json({
        msg: "Invalid service price"
      });
    }


    /* =========================
       CREATE BOOKING
    ========================= */

    const [result] = await db.query(
      `
      INSERT INTO bookings
      (
        user_id,
        technician_id,
        service_id,
        amount,
        booking_date,
        booking_time,
        address,
        phone,
        notes,
        status,
        payment_status,
        customer_verified
      )
      VALUES (
        ?,
        NULL,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        'pending',
        'pending',
        0
      )
      `,
      [
        userId,
        service_id,
        amount,
        booking_date,
        booking_time,
        address,
        user.phone,
        notes || null
      ]
    );


    /* =========================
       RESPONSE
    ========================= */

    return res.status(201).json({
      success: true,

      msg: "Booking created successfully",

      bookingId: result.insertId,

      service: {
        id: service.id,
        title: service.title
      },

      amount,

      status: "pending",

      payment_status: "pending",

      customer_verified: false
    });

  } catch (err) {

    console.error(
      "Create booking error:",
      err
    );

    return res.status(500).json({
      msg: "Failed to create booking"
    });
  }
});
router.put("/:id", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, technician_id } = req.body;

    /* =========================
       VALIDATE BOOKING
    ========================= */

    const [bookings] = await db.query(
      `
      SELECT id
      FROM bookings
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!bookings.length) {
      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    const allowedStatuses = [
      "pending",
      "confirmed",
      "assigned",
      "in_progress",
      "completed",
      "cancelled"
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        msg: "Invalid booking status"
      });
    }

    /* =========================
       VALIDATE TECHNICIAN
    ========================= */

    if (
      technician_id !== null &&
      technician_id !== undefined &&
      technician_id !== ""
    ) {
      const [technicians] = await db.query(
        `
        SELECT id
        FROM users
        WHERE id = ?
        AND role = 'technician'
        LIMIT 1
        `,
        [technician_id]
      );

      if (!technicians.length) {
        return res.status(400).json({
          msg: "Invalid technician"
        });
      }
    }

    /* =========================
       UPDATE BOOKING
    ========================= */

    await db.query(
      `
      UPDATE bookings
      SET
        technician_id = ?,
        status = ?
      WHERE id = ?
      `,
      [
        technician_id || null,
        status || "pending",
        id
      ]
    );

    return res.json({
      success: true,
      msg: "Booking updated successfully",
      bookingId: Number(id),
      technician_id: technician_id || null,
      status: status || "pending"
    });

  } catch (err) {
    console.error(
      "Admin booking update error:",
      err
    );

    return res.status(500).json({
      msg: "Failed to update booking"
    });
  }
});
router.get("/check-auth", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        city,
        specialization,
        experience,
        status
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(401).json({
        msg: "Technician not found"
      });
    }

    const technician = rows[0];

    res.json({
      authenticated: true,
      technician
    });

  } catch (err) {
    console.error("Technician check-auth error:", err);

    res.status(500).json({
      msg: "Failed to check authentication"
    });
  }
});
/* ================= GET ALL BOOKINGS (ADMIN) ================= */
router.get("/", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = String(req.user.role || "").toLowerCase();

    console.log("GET BOOKINGS:", {
      userId,
      role
    });

    let query = `
      SELECT
        b.*,

        u.name AS user_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        u.city AS customer_city,

        s.title AS service_name,
        s.title AS service_title,
        s.price AS service_price,
        s.description AS service_description,

        t.id AS technician_id,
        t.name AS technician_name,
        t.specialization AS technician_specialization

      FROM bookings b

      LEFT JOIN users u
        ON b.user_id = u.id

      LEFT JOIN services s
        ON b.service_id = s.id

      LEFT JOIN users t
        ON b.technician_id = t.id
        AND t.role = 'technician'
    `;

    const params = [];

    /* =========================
       ADMIN
       ========================= */

    if (role === "admin") {
      query += `
        ORDER BY b.id DESC
      `;
    }

    /* =========================
       CUSTOMER
       ========================= */

    else if (
      role === "customer" ||
      role === "user"
    ) {
      query += `
        WHERE b.user_id = ?
        ORDER BY b.id DESC
      `;

      params.push(userId);
    }

    /* =========================
       OTHER ROLES
       ========================= */

    else {
      return res.status(403).json({
        msg: "You are not allowed to view bookings"
      });
    }

    const [rows] = await db.query(
      query,
      params
    );

    console.log(
      "BOOKINGS RETURNED:",
      rows.length
    );

    res.json(rows);

  } catch (err) {

    console.error(
      "Bookings error:",
      err
    );

    res.status(500).json({
      msg: "Failed to fetch bookings"
    });
  }
});
router.get("/:id", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    console.log("GET BOOKING:", {
      bookingId,
      userId
    });

    const [rows] = await db.query(
      `
      SELECT
        b.*,

        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        u.city AS customer_city,

        s.title AS service_title,
        s.description AS service_description,
        s.price AS service_price,

        t.name AS technician_name

      FROM bookings b

      LEFT JOIN users u
        ON b.user_id = u.id

      LEFT JOIN services s
        ON b.service_id = s.id

      LEFT JOIN users t
        ON b.technician_id = t.id
        AND t.role = 'technician'

      WHERE b.id = ?
        AND b.user_id = ?

      LIMIT 1
      `,
      [bookingId, userId]
    );

    console.log("BOOKING RESULT:", rows);

    if (!rows.length) {
      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    const booking = rows[0];

    return res.json({
      ...booking,

      date: booking.booking_date,
      time: booking.booking_time,

      price: booking.amount,

      customer_verified:
        Number(booking.customer_verified) === 1
    });

  } catch (err) {
    console.error(
      "Get booking details error:",
      err
    );

    return res.status(500).json({
      msg: "Failed to load booking"
    });
  }
});
// GET logged-in user's bookings
router.get(
  "/my-bookings",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          b.*,
          s.title as service_name,
          s.price,
          s.image
        FROM bookings b
        JOIN services s 
          ON b.service_id = s.id
        WHERE b.user_id = ?
        ORDER BY b.id DESC
        `,
        [req.user.id]
      );

      res.json(rows);

    } catch (err) {
      console.log(err);
      res.status(500).json({
        msg: "Failed to fetch bookings"
      });
    }
  }
);
/* ================= UPDATE STATUS ================= */
/* =====================================================
   GENERATE CUSTOMER VERIFICATION CODE
===================================================== */
/* =====================================================
   GENERATE CUSTOMER VERIFICATION CODE
===================================================== */
/* =====================================================
   GENERATE CUSTOMER VERIFICATION CODE
===================================================== */

router.post(
  "/technician/my-jobs/:id/customer-verification",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const technicianId = req.user.id;
      const bookingId = req.params.id;

      /* =========================
         GET BOOKING + CUSTOMER
      ========================= */

      const [rows] = await db.query(
        `
        SELECT
          b.id,
          b.technician_id,
          b.status,
          b.customer_verified,

          u.name AS customer_name,
          u.phone AS customer_phone

        FROM bookings b

        LEFT JOIN users u
          ON b.user_id = u.id

        WHERE b.id = ?
          AND b.technician_id = ?

        LIMIT 1
        `,
        [
          bookingId,
          technicianId
        ]
      );

      /* =========================
         JOB CHECK
      ========================= */

      if (!rows.length) {
        return res.status(404).json({
          msg: "Job not found or not assigned to you"
        });
      }

      const booking = rows[0];

      console.log(
        "VERIFY CODE REQUEST:",
        {
          bookingId,
          technicianId,
          status: booking.status,
          customer_verified:
            booking.customer_verified
        }
      );

      /* =========================
         ALREADY VERIFIED
      ========================= */

      if (
        Number(booking.customer_verified) === 1
      ) {
        return res.status(400).json({
          msg: "Customer is already verified"
        });
      }

      /* =========================
         STATUS CHECK
      ========================= */

      const allowedStatuses = [
        "pending",
        "confirmed",
        "assigned"
      ];

      const currentStatus =
        String(booking.status || "")
          .trim()
          .toLowerCase();

      if (
        !allowedStatuses.includes(
          currentStatus
        )
      ) {
        return res.status(400).json({
          msg:
            "Customer verification is not available for this job",
          status: currentStatus
        });
      }

      /* =========================
         CUSTOMER PHONE CHECK
      ========================= */

      if (!booking.customer_phone) {
        return res.status(400).json({
          msg:
            "Customer does not have a registered mobile number"
        });
      }

      /* =========================
         GENERATE 6 DIGIT OTP
      ========================= */

      const verificationCode =
        String(
          Math.floor(
            100000 +
            Math.random() * 900000
          )
        );

      /* =========================
         10 MINUTE EXPIRY
      ========================= */

      const expiresAt = new Date(
        Date.now() +
        10 * 60 * 1000
      );

      /* =========================
         SAVE OTP
      ========================= */

      const [result] = await db.query(
        `
        UPDATE bookings
        SET
          customer_verification_code = ?,
          customer_verification_expires = ?
        WHERE id = ?
          AND technician_id = ?
          AND customer_verified = 0
        `,
        [
          verificationCode,
          expiresAt,
          bookingId,
          technicianId
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(400).json({
          msg:
            "Customer verification could not be started"
        });
      }

      /* =========================
         SEND SMS
      ========================= */

      await sendCustomerVerificationSMS({
        phone: booking.customer_phone,
        code: verificationCode,
        bookingId
      });

      /* =========================
         MASK PHONE
      ========================= */

      const phone = String(
        booking.customer_phone
      );

      const maskedPhone =
        phone.length >= 4
          ? `******${phone.slice(-4)}`
          : "******";

      /* =========================
         RESPONSE
      ========================= */

      return res.json({
        success: true,

        msg:
          "Verification code sent to customer mobile number",

        mobile: maskedPhone,

        expires_in: 600
      });

    } catch (err) {

      console.error(
        "Generate customer verification error:",
        err
      );

      return res.status(500).json({
        msg:
          "Failed to generate verification code"
      });
    }
  }
);
/* =====================================================
   VERIFY CUSTOMER
===================================================== */

router.post(
  "/technician/my-jobs/:id/customer-verification/verify",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const technicianId = req.user.id;
      const bookingId = req.params.id;

      const { verification_code } = req.body;

      /* =========================
         VALIDATE CODE
      ========================= */

      if (!verification_code) {
        return res.status(400).json({
          msg: "Verification code is required"
        });
      }

      /* =========================
         GET BOOKING
      ========================= */

      const [rows] = await db.query(
        `
        SELECT
          id,
          technician_id,
          status,
          customer_verified,
          customer_verification_code,
          customer_verification_expires
        FROM bookings
        WHERE id = ?
          AND technician_id = ?
        LIMIT 1
        `,
        [
          bookingId,
          technicianId
        ]
      );

      if (!rows.length) {
        return res.status(404).json({
          msg: "Job not found or not assigned to you"
        });
      }

      const booking = rows[0];

      /* =========================
         ALREADY VERIFIED
      ========================= */

      if (Number(booking.customer_verified) === 1) {
        return res.json({
          success: true,
          msg: "Customer is already verified",
          customer_verified: true
        });
      }

      /* =========================
         VALID STATUS
      ========================= */

      if (
        ![
          "pending",
          "confirmed",
          "assigned"
        ].includes(booking.status)
      ) {
        return res.status(400).json({
          msg: "Customer verification is not available for this job"
        });
      }

      /* =========================
         CODE EXISTS
      ========================= */

      if (!booking.customer_verification_code) {
        return res.status(400).json({
          msg: "No verification code has been generated"
        });
      }

      /* =========================
         CHECK EXPIRY
      ========================= */

      if (
        !booking.customer_verification_expires ||
        new Date(
          booking.customer_verification_expires
        ).getTime() < Date.now()
      ) {
        return res.status(400).json({
          msg: "Verification code has expired"
        });
      }

      /* =========================
         CHECK CODE
      ========================= */

      if (
        String(verification_code).trim() !==
        String(
          booking.customer_verification_code
        ).trim()
      ) {
        return res.status(400).json({
          msg: "Invalid verification code"
        });
      }

      /* =========================
         VERIFY CUSTOMER
      ========================= */

      await db.query(
        `
        UPDATE bookings
        SET
          customer_verified = 1,
          customer_verified_at = NOW(),
          customer_verification_code = NULL,
          customer_verification_expires = NULL
        WHERE id = ?
          AND technician_id = ?
        `,
        [
          bookingId,
          technicianId
        ]
      );

      return res.json({
        success: true,
        msg: "Customer verified successfully",
        customer_verified: true
      });

    } catch (err) {
      console.error(
        "Verify customer error:",
        err
      );

      return res.status(500).json({
        msg: "Failed to verify customer"
      });
    }
  }
);
router.get("/technician/jobs", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const technicianId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        b.*,
        s.title AS service_title,
        u.name AS customer_name,
        u.phone AS customer_phone,
        u.email AS customer_email,
        u.city AS customer_city
      FROM bookings b
      LEFT JOIN services s
        ON b.service_id = s.id
      LEFT JOIN users u
        ON b.user_id = u.id
      WHERE b.technician_id = ?
      ORDER BY b.id DESC
      `,
      [technicianId]
    );

    res.json(rows);

  } catch (err) {
    console.error("Technician jobs error:", err);

    res.status(500).json({
      msg: "Failed to fetch technician jobs"
    });
  }
});
/* =====================================================
   GET TECHNICIAN JOB DETAILS
===================================================== */

router.get(
  "/technician/my-jobs/:id",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const technicianId = req.user.id;
      const bookingId = req.params.id;

      const [rows] = await db.query(
        `
        SELECT
          /* =========================
             BOOKING
          ========================= */

          b.id,
          b.user_id,
          b.technician_id,
          b.service_id,

          b.amount,

          b.booking_date,
          b.booking_time,

          b.address,
          b.phone,
          b.notes,

          b.status,

          /* =========================
             PAYMENT
          ========================= */

          b.payment_status,
          b.payment_verified_at,

          /* =========================
             CUSTOMER VERIFICATION
          ========================= */

          b.customer_verified,
          b.customer_verification_code,
          b.customer_verification_expires,
          b.customer_verified_at,

          /* =========================
             JOB TIMESTAMPS
          ========================= */

          b.started_at,
          b.completed_at,

          b.created_at,

          /* =========================
             CUSTOMER
          ========================= */

          u.id AS customer_id,
          u.name AS customer_name,
          u.email AS customer_email,
          u.phone AS customer_phone,
          u.city AS customer_city,

          /* =========================
             SERVICE
          ========================= */

          s.id AS service_id,
          s.title AS service_name,
          s.description AS service_description,
          s.price AS service_price

        FROM bookings b

        LEFT JOIN users u
          ON b.user_id = u.id

        LEFT JOIN services s
          ON b.service_id = s.id

        WHERE b.id = ?
          AND b.technician_id = ?

        LIMIT 1
        `,
        [
          bookingId,
          technicianId
        ]
      );

      if (!rows.length) {
        return res.status(404).json({
          msg: "Job not found or not assigned to you"
        });
      }

      return res.json(rows[0]);

    } catch (err) {
      console.error(
        "Technician job details error:",
        err
      );

      return res.status(500).json({
        msg: "Failed to load job details"
      });
    }
  }
);
/* =====================================================
   TECHNICIAN UPDATE JOB STATUS
===================================================== */

router.put(
  "/technician/my-jobs/:id/status",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {

      const technicianId = req.user.id;

      const bookingId =
        req.params.id;

      const { status } =
        req.body;


      /* =========================
         ALLOWED STATUS
      ========================= */

      const allowedStatuses = [
        "in_progress",
        "completed"
      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({
          success: false,
          msg: "Invalid technician status"
        });

      }


      /* =========================
         GET BOOKING
      ========================= */

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            technician_id,
            status,
            customer_verified,
            started_at,
            completed_at
          FROM bookings
          WHERE id = ?
            AND technician_id = ?
          LIMIT 1
          `,
          [
            bookingId,
            technicianId
          ]
        );


      if (!rows.length) {

        return res.status(404).json({
          success: false,
          msg:
            "Job not found or not assigned to you"
        });

      }


      const booking =
        rows[0];


      /* =================================================
         START JOB
      ================================================= */

      if (
        status ===
        "in_progress"
      ) {

        const allowedStartStatuses = [
          "pending",
          "confirmed",
          "assigned"
        ];


        if (
          !allowedStartStatuses.includes(
            booking.status
          )
        ) {

          return res.status(400).json({
            success: false,
            msg:
              "Job cannot be started from its current status"
          });

        }


        /* -------------------------
           CUSTOMER VERIFICATION
        ------------------------- */

        if (
          Number(
            booking.customer_verified
          ) !== 1
        ) {

          return res.status(400).json({
            success: false,
            msg:
              "Customer verification is required before starting the job",

            code:
              "CUSTOMER_NOT_VERIFIED"
          });

        }


        /* -------------------------
           START JOB
        ------------------------- */

        const [result] =
          await db.query(
            `
            UPDATE bookings
            SET
              status = 'in_progress',
              started_at = NOW()
            WHERE id = ?
              AND technician_id = ?
              AND customer_verified = 1
              AND status IN (
                'pending',
                'confirmed',
                'assigned'
              )
            `,
            [
              bookingId,
              technicianId
            ]
          );


        if (
          result.affectedRows === 0
        ) {

          return res.status(400).json({
            success: false,
            msg:
              "Job could not be started"
          });

        }


        return res.status(200).json({

          success: true,

          msg:
            "Job started successfully",

          booking: {

            id:
              Number(
                bookingId
              ),

            status:
              "in_progress"

          }

        });

      }


      /* =================================================
         COMPLETE JOB
      ================================================= */

      if (
        status ===
        "completed"
      ) {

        let connection;


        try {

          /* ---------------------------------------
             START TRANSACTION
          --------------------------------------- */

          connection =
            await db.getConnection();

          await connection.beginTransaction();


          /* ---------------------------------------
             LOCK BOOKING ROW
          --------------------------------------- */

          const [bookingRows] =
            await connection.query(
              `
              SELECT
                id,
                technician_id,
                amount,
                total_amount,
                status,
                wallet_credited
              FROM bookings
              WHERE id = ?
                AND technician_id = ?
              LIMIT 1
              FOR UPDATE
              `,
              [
                bookingId,
                technicianId
              ]
            );


          if (!bookingRows.length) {

            await connection.rollback();

            return res.status(404).json({
              success: false,
              msg:
                "Booking not found"
            });

          }


          const bookingData =
            bookingRows[0];


          /* ---------------------------------------
             VALIDATE JOB STATUS
          --------------------------------------- */

          if (
            bookingData.status !==
            "in_progress"
          ) {

            await connection.rollback();

            return res.status(400).json({
              success: false,
              msg:
                "Job must be in progress before it can be completed"
            });

          }


          /* ---------------------------------------
             PREVENT DUPLICATE CREDIT
          --------------------------------------- */

          if (
            Number(
              bookingData.wallet_credited || 0
            ) === 1
          ) {

            await connection.rollback();

            return res.status(400).json({
              success: false,
              msg:
                "Wallet has already been credited for this booking"
            });

          }


          /* ---------------------------------------
             GET FINAL BOOKING AMOUNT

             PRIORITY:
             total_amount → amount
          --------------------------------------- */

          const totalAmount =
            Number(
              bookingData.total_amount ||
              bookingData.amount ||
              0
            );


          if (
            totalAmount <= 0
          ) {

            await connection.rollback();

            return res.status(400).json({
              success: false,
              msg:
                "Booking amount must be greater than zero"
            });

          }


          /* ---------------------------------------
             GET TECHNICIAN COMMISSION
          --------------------------------------- */

          const [technicianRows] =
            await connection.query(
              `
              SELECT
                commission_percent
              FROM users
              WHERE id = ?
                AND role = 'technician'
              LIMIT 1
              `,
              [
                technicianId
              ]
            );


          if (
            !technicianRows.length
          ) {

            await connection.rollback();

            return res.status(404).json({
              success: false,
              msg:
                "Technician not found"
            });

          }


          const technician =
            technicianRows[0];


          /*
          ---------------------------------------
          DEFAULT ADMIN COMMISSION
          ---------------------------------------
          */

          const DEFAULT_COMMISSION =
            20;


          /*
          ---------------------------------------
          CUSTOM COMMISSION

          NULL → DEFAULT COMMISSION
          ---------------------------------------
          */

          const adminCommissionPercent =

            technician.commission_percent !== null &&
            technician.commission_percent !== undefined

              ? Number(
                  technician.commission_percent
                )

              : DEFAULT_COMMISSION;


          /*
          ---------------------------------------
          VALIDATE COMMISSION
          ---------------------------------------
          */

          if (
            Number.isNaN(
              adminCommissionPercent
            ) ||

            adminCommissionPercent < 0 ||

            adminCommissionPercent > 100
          ) {

            await connection.rollback();

            return res.status(400).json({
              success: false,
              msg:
                "Invalid technician commission percentage"
            });

          }


          /*
          ---------------------------------------
          CALCULATE EARNINGS
          ---------------------------------------
          */

          const adminEarning =
            Number(
              (
                (
                  totalAmount *
                  adminCommissionPercent
                ) / 100
              ).toFixed(2)
            );


          const technicianEarning =
            Number(
              (
                totalAmount -
                adminEarning
              ).toFixed(2)
            );


          /* ---------------------------------------
             GET OR CREATE TECHNICIAN WALLET
          --------------------------------------- */

          const [walletRows] =
            await connection.query(
              `
              SELECT
                id,
                balance,
                status
              FROM technician_wallets
              WHERE technician_id = ?
              LIMIT 1
              FOR UPDATE
              `,
              [
                technicianId
              ]
            );


          let walletId;


          if (
            walletRows.length === 0
          ) {

            const [createWalletResult] =
              await connection.query(
                `
                INSERT INTO
                technician_wallets
                (
                  technician_id,
                  balance,
                  total_earned,
                  total_withdrawn,
                  pending_withdrawal,
                  status
                )
                VALUES
                (
                  ?,
                  0,
                  0,
                  0,
                  0,
                  'active'
                )
                `,
                [
                  technicianId
                ]
              );


            walletId =
              createWalletResult.insertId;


          } else {

            const wallet =
              walletRows[0];


            if (
              wallet.status !==
              "active"
            ) {

              await connection.rollback();

              return res.status(400).json({
                success: false,
                msg:
                  "Technician wallet is blocked"
              });

            }


            walletId =
              wallet.id;

          }


          /* ---------------------------------------
             CHECK DUPLICATE TRANSACTION
          --------------------------------------- */

          const [existingTransactionRows] =
            await connection.query(
              `
              SELECT
                id
              FROM wallet_transactions
              WHERE booking_id = ?
                AND technician_id = ?
                AND type = 'booking_earning'
              LIMIT 1
              `,
              [
                bookingId,
                technicianId
              ]
            );


          if (
            existingTransactionRows.length > 0
          ) {

            await connection.rollback();

            return res.status(400).json({
              success: false,
              msg:
                "Wallet earning already exists for this booking"
            });

          }


          /* ---------------------------------------
             CREDIT WALLET
          --------------------------------------- */

          const [walletUpdateResult] =
            await connection.query(
              `
              UPDATE technician_wallets

              SET

                balance =
                  balance + ?,

                total_earned =
                  total_earned + ?

              WHERE id = ?
                AND status = 'active'
              `,
              [
                technicianEarning,
                technicianEarning,
                walletId
              ]
            );


          if (
            walletUpdateResult.affectedRows === 0
          ) {

            throw new Error(
              "Wallet is blocked or unavailable"
            );

          }


          /* ---------------------------------------
             GET UPDATED BALANCE
          --------------------------------------- */

          const [updatedWalletRows] =
            await connection.query(
              `
              SELECT
                balance
              FROM technician_wallets
              WHERE id = ?
              LIMIT 1
              `,
              [
                walletId
              ]
            );


          const balanceAfter =
            Number(
              updatedWalletRows[0].balance
            );


          /* ---------------------------------------
             CREATE WALLET TRANSACTION
          --------------------------------------- */

          await connection.query(
            `
            INSERT INTO
            wallet_transactions
            (
              technician_id,
              wallet_id,
              booking_id,
              type,
              transaction_type,
              amount,
              balance_after,
              description,
              status
            )
            VALUES
            (
              ?,
              ?,
              ?,
              'booking_earning',
              'credit',
              ?,
              ?,
              ?,
              'completed'
            )
            `,
            [
              technicianId,
              walletId,
              bookingId,
              technicianEarning,
              balanceAfter,
              `Booking #${bookingId} completed earning credited to wallet`
            ]
          );


          /* ---------------------------------------
             COMPLETE BOOKING
             SAVE FINANCIAL SNAPSHOT
          --------------------------------------- */

          const [bookingUpdateResult] =
            await connection.query(
              `
              UPDATE bookings

              SET

                status =
                  'completed',

                completed_at =
                  NOW(),

                commission_percent =
                  ?,

                admin_earning =
                  ?,

                technician_earning =
                  ?,

                wallet_credited =
                  1,

                wallet_credited_at =
                  NOW()

              WHERE id = ?
                AND technician_id = ?
                AND status = 'in_progress'
                AND
                (
                  wallet_credited = 0
                  OR wallet_credited IS NULL
                )
              `,
              [
                adminCommissionPercent,
                adminEarning,
                technicianEarning,
                bookingId,
                technicianId
              ]
            );


          if (
            bookingUpdateResult.affectedRows === 0
          ) {

            throw new Error(
              "Job could not be completed"
            );

          }


          /* ---------------------------------------
             COMMIT TRANSACTION
          --------------------------------------- */

          await connection.commit();


          return res.status(200).json({

            success: true,

            msg:
              "Job completed and wallet credited successfully",


            booking: {

              id:
                Number(
                  bookingId
                ),

              status:
                "completed"

            },


            earnings: {

              totalAmount,

              commissionPercent:
                adminCommissionPercent,

              adminEarning,

              technicianEarning,

              walletBalance:
                balanceAfter

            }

          });


        } catch (error) {

          console.error(
            "Complete job error:",
            error
          );


          if (connection) {

            try {

              await connection.rollback();

            } catch (rollbackError) {

              console.error(
                "Rollback error:",
                rollbackError
              );

            }

          }


          return res.status(500).json({

            success: false,

            msg:
              error.message ||
              "Failed to complete job"

          });


        } finally {

          if (connection) {

            connection.release();

          }

        }

      }


      return res.status(400).json({
        success: false,
        msg:
          "Unsupported status update"
      });


    } catch (err) {

      console.error(
        "Technician status update error:",
        err
      );


      return res.status(500).json({
        success: false,
        msg:
          "Failed to update job status"
      });

    }

  }
);
router.get(
  "/technician/my-jobs",
  verifyAdminToken, adminOnly,
  async (req, res) => {
    try {
      const technicianId = req.user.id;

      console.log(
        "Technician ID:",
        technicianId
      );

      const [jobs] = await db.query(
        `
        SELECT
          /* =========================
             BOOKING DETAILS
          ========================= */

          b.id AS booking_id,
          b.user_id,
          b.technician_id,
          b.service_id,

          b.booking_date,
          b.booking_time,

          b.address,
          b.phone,
          b.notes,

          b.status,
          b.created_at,

          /* =========================
             CUSTOMER DETAILS
          ========================= */

          u.id AS customer_id,
          u.name AS customer_name,
          u.email AS customer_email,
          u.phone AS customer_phone,
          u.city AS customer_city,

          /* =========================
             SERVICE DETAILS
          ========================= */

          s.id AS service_id,
          s.title AS service_name,
          s.description AS service_description,
          s.price AS service_price

        FROM bookings b

        LEFT JOIN users u
          ON b.user_id = u.id

        LEFT JOIN services s
          ON b.service_id = s.id

        WHERE b.technician_id = ?

        ORDER BY b.id DESC
        `,
        [technicianId]
      );

      res.json(jobs);

    } catch (err) {

      console.error(
        "Technician jobs error:",
        err
      );

      res.status(500).json({
        msg: "Failed to load technician jobs"
      });
    }
  }
);
router.get("/technician/earnings", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const technicianId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        b.id,
        s.title AS service,
        b.booking_date AS date,
        b.status,
        b.amount AS amount
      FROM bookings b
      LEFT JOIN services s
        ON b.service_id = s.id
      WHERE b.technician_id = ?
        AND b.status = 'Completed'
      ORDER BY b.id DESC
      `,
      [technicianId]
    );

    res.json(rows);

  } catch (err) {
    console.error("Technician earnings error:", err);

    res.status(500).json({
      msg: "Failed to fetch technician earnings"
    });
  }
});
router.get("/technicians/available", verifyAdminToken, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        phone,
        city,
        specialization,
        experience,
        status
      FROM users
      WHERE role = 'technician'
      AND status = 'active'
      ORDER BY name ASC
    `);

    res.json(rows);

  } catch (err) {
    console.error("Available technicians error:", err);

    res.status(500).json({
      msg: "Failed to fetch technicians"
    });
  }
});
export default router;
/* =====================================================
   DEVELOPMENT SMS
   FREE / LOCAL TESTING ONLY
===================================================== */

const sendCustomerVerificationSMS = async ({
  phone,
  code,
  bookingId
}) => {
    console.log("\n========================================");
  console.log("📱 CUSTOMER VERIFICATION - DEVELOPMENT MODE");
  console.log("========================================");
  console.log(`Booking ID : #${bookingId}`);
  console.log(`Mobile     : ${phone}`);
  console.log(`OTP        : ${code}`);
  console.log(`Expires    : 10 minutes`);
  console.log("----------------------------------------");
  console.log(
    `Your service verification code is ${code}. ` +
    `This code is valid for 10 minutes.`
  );
  console.log("========================================\n");

  /*
    FREE DEVELOPMENT MODE

    No real SMS is sent.

    Later we can replace this function with:
    MSG91 / Twilio / Fast2SMS / other provider.
  */

  return true;
};