const Prescription = require("./../models/prescription.model");

// Create a new prescription
const createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a prescription by ID
const updatePrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a prescription by ID
const deletePrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get prescriptions by patientId
const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId,
    });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get prescriptions by doctorId
const getPrescriptionsByDoctorId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctorId: req.params.doctorId,
    });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescriptionById,
  deletePrescriptionById,
  getPrescriptionsByPatientId,
  getPrescriptionsByDoctorId,
};
