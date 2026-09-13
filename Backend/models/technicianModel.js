const db = require("../config/db");

exports.getAllTechnicians = async () => {
  const [rows] = await db.query("SELECT * FROM technicians");
  return rows;
};

exports.getTechnicianByUser = async (user_id) => {
  const [rows] = await db.query(
    "SELECT * FROM technicians WHERE user_id = ?",
    [user_id]
  );
  return rows[0];
};

exports.createTechnician = async (technician) => {
  const { user_id, skills, experience, status } = technician;

  const [result] = await db.query(
    "INSERT INTO technicians (user_id, skills, experience, status) VALUES (?, ?, ?, ?)",
    [user_id, skills, experience, status]
  );

  return result;
};