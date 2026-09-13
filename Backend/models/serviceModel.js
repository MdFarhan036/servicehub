const db = require("../config/db");

exports.getServices = async () => {

  const [rows] = await db.query("SELECT * FROM services");
  return rows;

};

exports.getServiceById = async (id) => {

  const [rows] = await db.query(
    "SELECT * FROM services WHERE id = ?",
    [id]
  );

  return rows[0];

};
exports.togglePopular = async (id, isPopular) => {
  const [result] = await db.query(
    "UPDATE services SET is_popular=? WHERE id=?",
    [isPopular, id]
  );
  return result;
};

exports.toggleDailyDeal = async (id, isDailyDeal, dealPrice) => {
  const [result] = await db.query(
    "UPDATE services SET is_daily_deal=?, daily_deal_price=? WHERE id=?",
    [isDailyDeal, dealPrice, id]
  );
  return result;
};

exports.getPopularServices = async () => {
  const [rows] = await db.query(
    "SELECT * FROM services WHERE is_popular=1"
  );
  return rows;
};

exports.getDailyDeals = async () => {
  const [rows] = await db.query(
    `SELECT * FROM services 
     WHERE is_daily_deal=1
     ORDER BY id DESC`
  );
  return rows;
};
