const db = require("../config/db");

exports.createPlan = async (plan) => {

  const { name, duration, price, description } = plan;

  const [result] = await db.query(
    "INSERT INTO maintenance_plans (name, duration, price, description) VALUES (?, ?, ?, ?)",
    [name, duration, price, description]
  );

  return result;
};

exports.getPlans = async () => {

  const [rows] = await db.query("SELECT * FROM maintenance_plans");

  return rows;

};