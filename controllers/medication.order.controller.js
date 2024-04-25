const MedicationOrder = require("../models/medication.order.model");

// Create a new medication order
const createMedicationOrder = async (req, res) => {
  try {
    const medicationOrder = new MedicationOrder(req.body);
    await medicationOrder.save();
    res.status(201).json(medicationOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFrequentMedicationItemByPharmacyId = async (req, res) => {
  try {
    const pharmacyId = req.params.pharmacyId;
    const mongoose = require("mongoose");

    const items = await MedicationOrder.aggregate([
      { $match: { pharmacyId: new mongoose.Types.ObjectId(pharmacyId) } },
      {
        $lookup: {
          from: "medicines",
          localField: "medicineId",
          foreignField: "_id",
          as: "medicine",
        },
      },
      { $unwind: "$medicine" },
      { $unwind: "$medicine.medicineDetails" },
      {
        $group: {
          _id: "$medicine.medicineDetails.name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (items.length === 0 || !items[0]._id) {
      return res.status(404).json({ message: "No items found" });
    }

    const mostFrequentItem = items[0]._id;
    res.json({ name: mostFrequentItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all medication orders by patientId
const getMedicationOrdersByPatientId = async (req, res) => {
  try {
    const medicationOrders = await MedicationOrder.find({
      patientId: req.params.patientId,
    });
    res.status(200).json(medicationOrders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all medication orders by pharmacyId
const getMedicationOrdersByPharmacyId = async (req, res) => {
  try {
    const medicationOrders = await MedicationOrder.find({
      pharmacyId: req.params.pharmacyId,
    });
    res.status(200).json(medicationOrders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single medication order by ID
const getMedicationOrderById = async (req, res) => {
  try {
    const medicationOrder = await MedicationOrder.findById(req.params.id);
    if (!medicationOrder) {
      return res.status(404).json({ error: "Medication Order not found" });
    }
    res.status(200).json(medicationOrder);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a medication order by ID
const updateMedicationOrderById = async (req, res) => {
  try {
    const medicationOrder = await MedicationOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!medicationOrder) {
      return res.status(404).json({ error: "Medication Order not found" });
    }
    res.status(200).json(medicationOrder);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a medication order by ID
const deleteMedicationOrderById = async (req, res) => {
  try {
    const medicationOrder = await MedicationOrder.findByIdAndDelete(
      req.params.id
    );
    if (!medicationOrder) {
      return res.status(404).json({ error: "Medication Order not found" });
    }
    res.status(204).json({ message: "Order Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createMedicationOrder,
  getMedicationOrdersByPatientId,
  getMedicationOrdersByPharmacyId,
  getFrequentMedicationItemByPharmacyId,
  getMedicationOrderById,
  updateMedicationOrderById,
  deleteMedicationOrderById,
};
