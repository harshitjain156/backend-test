const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription.controller");

router.post("/prescriptions", prescriptionController.createPrescription);
router.get("/prescriptions", prescriptionController.getAllPrescriptions);
router.get("/prescriptions/:id", prescriptionController.getPrescriptionById);
router.put("/prescriptions/:id", prescriptionController.updatePrescriptionById);
router.delete(
  "/prescriptions/:id",
  prescriptionController.deletePrescriptionById
);
router.get(
  "/prescriptions/patient/:patientId",
  prescriptionController.getPrescriptionsByPatientId
);
router.get(
  "/prescriptions/doctor/:doctorId",
  prescriptionController.getPrescriptionsByDoctorId
);

module.exports = router;
