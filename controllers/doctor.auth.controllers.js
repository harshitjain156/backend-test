const { generateToken, sendResponseWithToken } = require("../utils/auth.utils");
const bcrypt = require("bcrypt");

const Doctor = require("../models/doctor.model");

exports.registerDoctor = async (req, res) => {
  try {
    // Create new doctor
    const doctor = new Doctor(req.body);
    await doctor.save();

    // Send response with token
    sendResponseWithToken(doctor, 201, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Send response with token
    sendResponseWithToken(doctor, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
