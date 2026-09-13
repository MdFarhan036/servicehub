const Service = require("../models/serviceModel");

const getServices = async (req, res) => {
  try {

    const services = await Service.getServices();
    res.json(services);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {

    const service = await Service.getServiceById(req.params.id);
    res.json(service);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const togglePopular = async (req, res) => {
  try {
    const { is_popular } = req.body;

    await Service.togglePopular(
      req.params.id,
      is_popular
    );

    res.json({
      success: true,
      message: "Popular updated"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleDailyDeal = async (req, res) => {
  try {
    const { is_daily_deal, daily_deal_price } = req.body;

    await Service.toggleDailyDeal(
      req.params.id,
      is_daily_deal,
      daily_deal_price
    );

    res.json({
      success: true,
      message: "Daily deal updated"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPopularServices = async (req, res) => {
  try {
    const data = await Service.getPopularServices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDailyDeals = async (req, res) => {
  try {
    const data = await Service.getDailyDeals();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getServices,
  getServiceById,
  togglePopular,
  toggleDailyDeal,
  getPopularServices,
  getDailyDeals
};