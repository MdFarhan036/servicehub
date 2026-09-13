import { db } from "../config/db.js";


/*
==========================================
GET LOGGED-IN TECHNICIAN WALLET
==========================================
*/

export const getMyWallet = async (req, res) => {

  try {

    const technicianId = req.user.id;


    /*
    FIND TECHNICIAN WALLET
    */

    const [walletRows] = await db.query(
      `
      SELECT *
      FROM technician_wallets
      WHERE technician_id = ?
      LIMIT 1
      `,
      [technicianId]
    );


    /*
    WALLET ALREADY EXISTS
    */

    if (walletRows.length > 0) {

      return res.status(200).json({

        success: true,

        wallet: walletRows[0],

      });

    }


    /*
    CREATE WALLET AUTOMATICALLY
    */

    const [result] = await db.query(
      `
      INSERT INTO technician_wallets
      (
        technician_id
      )
      VALUES
      (
        ?
      )
      `,
      [technicianId]
    );


    /*
    FETCH NEWLY CREATED WALLET
    */

    const [newWalletRows] = await db.query(
      `
      SELECT *
      FROM technician_wallets
      WHERE id = ?
      LIMIT 1
      `,
      [result.insertId]
    );


    return res.status(201).json({

      success: true,

      wallet: newWalletRows[0],

    });


  } catch (error) {

    console.error(
      "GET MY WALLET ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to fetch wallet",

    });

  }

};


/*
==========================================
GET TECHNICIAN WALLET TRANSACTIONS
==========================================
*/

export const getMyTransactions =
  async (req, res) => {

    try {

      const technicianId =
        req.user.id;


      const [transactions] =
        await db.query(
          `
          SELECT

            /*
            WALLET TRANSACTION
            */

            wt.id,

            wt.technician_id,

            wt.wallet_id,

            wt.booking_id,

            wt.type,

            wt.transaction_type,

            wt.amount,

            wt.balance_after,

            wt.description,

            wt.status,

            wt.created_at,


            /*
            BOOKING DETAILS
            */

            b.service_id,

            b.booking_date,

            b.booking_time,


            /*
            SERVICE NAME
            */

            s.title AS service_name


          FROM wallet_transactions wt


          /*
          BOOKING JOIN
          */

          LEFT JOIN bookings b

            ON wt.booking_id =
              b.id


          /*
          SERVICE JOIN
          */

          LEFT JOIN services s

            ON b.service_id =
              s.id


          /*
          ONLY LOGGED-IN
          TECHNICIAN TRANSACTIONS
          */

          WHERE

            wt.technician_id = ?


          /*
          LATEST FIRST
          */

          ORDER BY

            wt.created_at DESC
          `,
          [
            technicianId
          ]
        );


      return res.status(200).json({

        success: true,

        transactions,

      });


    } catch (error) {

      console.error(
        "GET WALLET TRANSACTIONS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch wallet transactions",

      });

    }

  };