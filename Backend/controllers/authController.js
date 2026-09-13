const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/*
==========================================
REGISTER
==========================================
*/

exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "All fields required"
      });

    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const sql = `
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
    `;


    db.query(
      sql,
      [
        name,
        email,
        hashedPassword
      ],
      (err, result) => {

        if (err) {

          console.error(
            "Registration error:",
            err
          );

          return res.status(500).json({
            message:
              "Registration failed"
          });

        }


        res.status(201).json({
          success: true,
          message:
            "User registered successfully",
          userId:
            result.insertId
        });

      }
    );

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message:
        "Registration failed"
    });

  }

};


/*
==========================================
LOGIN
==========================================
*/

exports.login = (req, res) => {

  const {
    email,
    password
  } = req.body;


  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
  `;


  db.query(
    sql,
    [email],
    async (
      err,
      results
    ) => {

      if (err) {

        console.error(
          "Login database error:",
          err
        );

        return res.status(500).json({
          message:
            "Server error"
        });

      }


      if (
        results.length === 0
      ) {

        return res.status(401).json({
          message:
            "Invalid email or password"
        });

      }


      const user =
        results[0];


      try {

        const passwordMatch =
          await bcrypt.compare(
            password,
            user.password
          );


        if (!passwordMatch) {

          return res.status(401).json({
            message:
              "Invalid email or password"
          });

        }


        /*
        ==========================================
        CREATE JWT WITH ROLE
        ==========================================
        */

        const token =
          jwt.sign(
            {
              id:
                user.id,

              email:
                user.email,

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
        ==========================================
        STORE JWT IN HTTP-ONLY COOKIE
        ==========================================
        */

        res.cookie(
          "token",
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
        ==========================================
        RESPONSE
        ==========================================
        */

        return res.status(200).json({

          success:
            true,

          message:
            "Login successful",

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


      } catch (error) {

        console.error(
          "Login error:",
          error
        );

        return res.status(500).json({
          message:
            "Login error"
        });

      }

    }
  );

};


/*
==========================================
GET CURRENT LOGGED-IN USER
/auth/me
==========================================
*/

exports.getMe = (

  req,
  res

) => {

  const userId =
    req.user.id;


  const sql = `
    SELECT
      id,
      name,
      email,
      role
    FROM users
    WHERE id = ?
    LIMIT 1
  `;


  db.query(
    sql,
    [userId],
    (
      err,
      results
    ) => {

      if (err) {

        console.error(
          "Get user error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to fetch user"
        });

      }


      if (
        results.length === 0
      ) {

        return res.status(404).json({
          message:
            "User not found"
        });

      }


      return res.status(200).json({

        success:
          true,

        user:
          results[0]

      });

    }
  );

};


/*
==========================================
LOGOUT
==========================================
*/

exports.logout = (
  req,
  res
) => {

  res.clearCookie(
    "token",
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

    message:
      "Logged out successfully"

  });

};