import { db } from "../config/db.js";


/*
==========================================
GET ALL TECHNICIANS WITH COMMISSION
==========================================
*/

export const getTechnicianCommissions =
  async (req, res) => {

    try {

      const [technicians] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            commission_percent

          FROM users

          WHERE role = 'technician'

          ORDER BY name ASC
          `
        );


      return res.status(200).json({

        success: true,

        technicians,

      });


    } catch (error) {

      console.error(
        "GET TECHNICIAN COMMISSIONS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to fetch technician commissions",

      });

    }

  };


/*
==========================================
UPDATE TECHNICIAN COMMISSION
==========================================
*/

export const updateTechnicianCommission =
  async (req, res) => {

    try {

      const technicianId =
        req.params.id;


      const {
        commission_percent
      } = req.body;


      /*
      COMMISSION IS REQUIRED
      FOR UPDATE
      */

      if (
        commission_percent === undefined ||
        commission_percent === null ||
        commission_percent === ""
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Commission percentage is required",

        });

      }


      const commission =
        Number(
          commission_percent
        );


      /*
      VALIDATE
      */

      if (
        Number.isNaN(
          commission
        ) ||

        commission < 0 ||

        commission > 100
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Commission must be between 0 and 100",

        });

      }


      /*
      CHECK TECHNICIAN EXISTS
      */

      const [technicianRows] =
        await db.query(
          `
          SELECT
            id,
            name,
            email

          FROM users

          WHERE
            id = ?
            AND role = 'technician'

          LIMIT 1
          `,
          [
            technicianId
          ]
        );


      if (
        technicianRows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Technician not found",

        });

      }


      /*
      UPDATE COMMISSION
      */

      await db.query(
        `
        UPDATE users

        SET
          commission_percent = ?

        WHERE
          id = ?
        `,
        [
          commission,
          technicianId
        ]
      );


      /*
      RETURN UPDATED TECHNICIAN
      */

      const [updatedRows] =
        await db.query(
          `
          SELECT
            id,
            name,
            email,
            commission_percent

          FROM users

          WHERE id = ?

          LIMIT 1
          `,
          [
            technicianId
          ]
        );


      return res.status(200).json({

        success: true,

        message:
          "Technician commission updated successfully",

        technician:
          updatedRows[0],

      });


    } catch (error) {

      console.error(
        "UPDATE TECHNICIAN COMMISSION ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to update technician commission",

      });

    }

  };


/*
==========================================
RESET TECHNICIAN TO DEFAULT COMMISSION
==========================================
*/

export const resetTechnicianCommission =
  async (req, res) => {

    try {

      const technicianId =
        req.params.id;


      /*
      CHECK TECHNICIAN
      */

      const [technicianRows] =
        await db.query(
          `
          SELECT id

          FROM users

          WHERE
            id = ?
            AND role = 'technician'

          LIMIT 1
          `,
          [
            technicianId
          ]
        );


      if (
        technicianRows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Technician not found",

        });

      }


      /*
      SET NULL
      NULL = USE DEFAULT COMMISSION
      */

      await db.query(
        `
        UPDATE users

        SET
          commission_percent = NULL

        WHERE
          id = ?
        `,
        [
          technicianId
        ]
      );


      return res.status(200).json({

        success: true,

        message:
          "Technician commission reset to default",

      });


    } catch (error) {

      console.error(
        "RESET TECHNICIAN COMMISSION ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to reset technician commission",

      });

    }

  };