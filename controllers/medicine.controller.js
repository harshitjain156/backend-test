const Medicine = require("../models/medicine.model");

// Create a new medicine
const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all medicines by pharmacyId
const getMedicinesByPharmacyId = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      pharmacyId: req.params.pharmacyId,
    });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single medicine by ID
const getMedicineById = async (req, res) => {
  try {
    console.log("Attempting to fetch medicine ID:", req.params.id); // This should be your first console.log
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      console.log("Medicine not found for ID:", req.params.id);
      return res.status(404).json({ error: "Medicine not found" });
    }
    console.log("Medicine found:", medicine);
    res.status(200).json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a medicine by ID
const updateMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a medicine by ID
const deleteMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(204).json({ message: "Medicine deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMedicineInPharmacy = async (req, res) => {
  try {
    const { medicineId, pharmacyId } = req.params;
    const medicine = await Medicine.findOneAndDelete({
      _id: medicineId,
      pharmacyId: pharmacyId,
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ error: "Medicine not found in the specified pharmacy" });
    }

    res.status(204).json({ message: "Medicine deleted from the pharmacy" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMedicineByPharmacyId = async (req, res) => {
  try {
    const { medicineId, pharmacyId } = req.params;
    const updateData = req.body;

    const medicine = await Medicine.findOne({
      _id: medicineId,
      pharmacyId: pharmacyId,
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ error: "Medicine not found in the specified pharmacy" });
    }

    Object.assign(medicine, updateData);

    await medicine.save();

    res
      .status(200)
      .json({ message: "Medicine updated successfully", medicine });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error(error);
  }
};

const addMedicineToPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { name, description, sideEffects, group, stockLevel, price } =
      req.body;

    const newMedicine = new Medicine({
      pharmacyId: pharmacyId, // Set the pharmacyId from the parameters
      medicineDetails: [{ name, description, sideEffects, group }], // Set the details from the body
      stockLevel,
      price,
    });

    await newMedicine.save();

    res.status(201).json({
      message: "New medicine added successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding medicine", error: error });
  }
};

module.exports = {
  createMedicine,
  addMedicineToPharmacy,
  getAllMedicines,
  getMedicineById,
  updateMedicineById,
  deleteMedicineById,
  updateMedicineByPharmacyId,
  deleteMedicineInPharmacy,
  getMedicinesByPharmacyId,
};
