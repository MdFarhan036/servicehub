router.get(
  "/unread-count",
  verifyAdminToken,
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `
          SELECT COUNT(*) AS unreadCount
          FROM notifications
          WHERE user_id = ?
          AND is_read = 0
          `,
          [
            req.user.id
          ]
        );


      return res.json({

        success: true,

        unreadCount:
          rows[0].unreadCount

      });

    } catch (error) {

      console.error(
        "Unread notification count error:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch unread notification count"

      });

    }

  }
);