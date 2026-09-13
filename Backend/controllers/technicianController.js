const Technician = require("../models/technicianModel");

const registerTechnician = async (req, res) => {
  try {

    const { user_id, skills, experience } = req.body;

    const technician = {
      user_id,
      skills,
      experience,
      status: "active"
    };

    const result = await Technician.createTechnician(technician);

    res.json({
      message: "Technician registered successfully",
      technicianId: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTechnicians = async (req, res) => {
  try {

    const technicians = await Technician.getAllTechnicians();
    res.json(technicians);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTechnicianProfile = async (req, res) => {
  try {

    const technician = await Technician.getTechnicianByUser(req.params.user_id);
    res.json(technician);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerTechnician,
  getTechnicians,
  getTechnicianProfile
};