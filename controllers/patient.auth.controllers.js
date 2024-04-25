const { generateToken, sendResponseWithToken } = require("../utils/auth.utils");
const bcrypt = require("bcrypt");

const Patient = require("../models/patient.model");

exports.registerPatient = async (req, res) => {
  try {
    // Create new patient
    const patient = new Patient(req.body);
    await patient.save();

    // Send response with token
    sendResponseWithToken(patient, 201, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginPatient = async (req, res) => {
  console.log("Received login request for patient");

  try {
    const { username, password } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Send response with token
    sendResponseWithToken(patient, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
