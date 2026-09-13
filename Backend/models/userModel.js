const db = require("../config/db");

exports.createUser = async (user) => {

  const { name, email, password } = user;

  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );

  return result;
};

exports.getUserByEmail = async (email) => {

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};