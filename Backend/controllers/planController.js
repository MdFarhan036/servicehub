const Plan = require("../models/planModel");

const createPlan = async (req, res) => {
  try {

    const result = await Plan.createPlan(req.body);

    res.json({
      message: "Plan created successfully",
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlans = async (req, res) => {
  try {

    const plans = await Plan.getPlans();
    res.json(plans);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPlan,
  getPlans
};