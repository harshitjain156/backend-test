const Patient = require("../models/patient.model");

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific patient by ID
const getPatient = async (req, res) => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ error: "Bad Request, PatientId Id should be provided" });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new patient
const createPatient = async (req, res) => {
  try {
    // Validate required parameters
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      address,
      phone,
      dateOfBirth,
      gender,
    } = req.body;
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !phone ||
      !dateOfBirth ||
      !gender
    ) {
      return res
        .status(400)
        .json({ error: "All required parameters must be provided" });
    }

    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a patient by ID
const updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const updateData = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (updateData.username) patient.username = updateData.username;
    if (updateData.password) patient.password = updateData.password;
    if (updateData.firstName) patient.firstName = updateData.firstName;
    if (updateData.lastName) patient.lastName = updateData.lastName;
    if (updateData.email) patient.email = updateData.email;
    if (updateData.address) patient.address = updateData.address;
    if (updateData.phone) patient.phone = updateData.phone;
    if (updateData.dateOfBirth) patient.dateOfBirth = updateData.dateOfBirth;
    if (updateData.gender) patient.gender = updateData.gender;
    if (updateData.additionalInfo) {
      for (const [key, value] of Object.entries(updateData.additionalInfo)) {
        patient.additionalInfo.set(key, value);
      }
    }

    const updatedPatient = await patient.save();

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Insert entry to additional info in a patient by ID
const insertAdditionalInfo = async (req, res) => {
  try {
    const { key, value } = req.body;

    // Check if key and value are present for insertion
    if (!key || !value) {
      return res
        .status(400)
        .json({ error: "Both key and value must be provided for insertion" });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: { [`additionalInfo.${key}`]: value } }, // Use $set to insert the key-value pair
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete entry from additional info in a patient by ID
const deleteAdditionalInfo = async (req, res) => {
  try {
    const { key } = req.params;

    // Check if key is present for deletion
    if (!key) {
      return res
        .status(400)
        .json({ error: "Key must be provided for deletion" });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $unset: { [`additionalInfo.${key}`]: 1 } }, // Use $unset to delete the key-value pair
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  insertAdditionalInfo,
  deleteAdditionalInfo,
};
