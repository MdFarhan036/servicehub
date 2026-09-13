const db = require("../config/db");

/* CREATE BOOKING */
exports.createBooking = (req, res) => {
  const { service_id, service_name, phone, date, time } = req.body;
  const user_id = req.user.id;

  const sql = `
  INSERT INTO bookings 
  (user_id, service_id, service_name, phone, booking_date, booking_time)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, service_id, service_name, phone, date, time],
    (err, result) => {
      if (err) {
  console.error(err); // 👈 shows real error in terminal
  return res.status(500).json({ message: "Booking failed", error: err });
}

      res.json({
        message: "Booking created successfully",
        bookingId: result.insertId
      });
    }
  );
};

/* GET USER BOOKINGS */
exports.getMyBookings = (req, res) => {
  const user_id = req.user.id;

  const sql = `
  SELECT * FROM bookings
  WHERE user_id = ?
  ORDER BY created_at DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bookings" });
    }

    res.json(results);
  });
};

/* ADMIN: GET ALL BOOKINGS */
exports.getAllBookings = (req, res) => {
  const sql = `
  SELECT bookings.*, users.name
  FROM bookings
  JOIN users ON bookings.user_id = users.id
  ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bookings" });
    }

    res.json(results);
  });
};