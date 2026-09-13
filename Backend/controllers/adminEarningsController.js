import { db } from "../config/db.js";


/*
==========================================
ADMIN EARNINGS SUMMARY
==========================================
*/

export const getAdminEarningsSummary =
  async (req, res) => {

    try {

      /*
      TOTAL COMPLETED BOOKINGS
      */

      const [summaryRows] =
        await db.query(
          `
          SELECT

            COUNT(*) AS total_completed_jobs,


            /*
            TOTAL CUSTOMER REVENUE
            */

            COALESCE(
              SUM(total_amount),
              0
            ) AS total_revenue,


            /*
            TOTAL ADMIN EARNINGS
            */

            COALESCE(
              SUM(admin_earning),
              0
            ) AS total_admin_earnings,


            /*
            TOTAL TECHNICIAN PAYOUT
            */

            COALESCE(
              SUM(technician_earning),
              0
            ) AS total_technician_earnings,


            /*
            THIS MONTH ADMIN EARNINGS
            */

            COALESCE(
              SUM(
                CASE

                  WHEN
                    MONTH(completed_at) =
                    MONTH(CURRENT_DATE())

                  AND
                    YEAR(completed_at) =
                    YEAR(CURRENT_DATE())

                  THEN admin_earning

                  ELSE 0

                END
              ),
              0
            ) AS this_month_admin_earnings


          FROM bookings


          WHERE
            status = 'completed'
          `
        );


      return res.status(200).json({

        success: true,

        summary:
          summaryRows[0],

      });


    } catch (error) {

      console.error(
        "ADMIN EARNINGS SUMMARY ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch admin earnings",

      });

    }

  };


/*
==========================================
ADMIN EARNINGS BY TECHNICIAN
==========================================
*/

export const getTechnicianEarningsReport =
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT

            u.id AS technician_id,

            u.name AS technician_name,


            COUNT(
              b.id
            ) AS completed_jobs,


            COALESCE(
              SUM(
                b.total_amount
              ),
              0
            ) AS total_booking_amount,


            COALESCE(
              SUM(
                b.technician_earning
              ),
              0
            ) AS technician_earnings,


            COALESCE(
              SUM(
                b.admin_earning
              ),
              0
            ) AS admin_earnings


          FROM bookings b


          INNER JOIN users u

            ON
              b.technician_id =
              u.id


          WHERE

            b.status =
            'completed'


          GROUP BY

            u.id,
            u.name


          ORDER BY

            admin_earnings DESC
          `
        );


      return res.status(200).json({

        success: true,

        technicians:
          rows,

      });


    } catch (error) {

      console.error(
        "TECHNICIAN EARNINGS REPORT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch technician earnings report",

      });

    }

  };


/*
==========================================
ADMIN BOOKING EARNINGS HISTORY
==========================================
*/

export const getAdminEarningsHistory =
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT

            b.id AS booking_id,

            b.total_amount,

            b.commission_percent,

            b.admin_earning,

            b.technician_earning,

            b.completed_at,


            /*
            SERVICE
            */

            s.title AS service_name,


            /*
            TECHNICIAN
            */

            u.name AS technician_name


          FROM bookings b


          LEFT JOIN services s

            ON
              b.service_id =
              s.id


          LEFT JOIN users u

            ON
              b.technician_id =
              u.id


          WHERE

            b.status =
            'completed'


          ORDER BY

            b.completed_at DESC
          `
        );


      return res.status(200).json({

        success: true,

        earnings:
          rows,

      });


    } catch (error) {

      console.error(
        "ADMIN EARNINGS HISTORY ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch earnings history",

      });

    }

  };