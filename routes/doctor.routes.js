const express = require("express");
const multer = require("multer");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const upload = multer({ dest: "uploads/" });

router.post("/ai-symptom-analysis", doctorController.getAIDrivenRecommendation);
router.post("/doctors", doctorController.createDoctor);
router.post(
  "/doctors/:id/profile-picture",
  upload.single("profilePicture"),
  doctorController.uploadProfilePicture
);
router.get("/doctors", doctorController.getAllDoctors);
router.get("/doctors/:id", doctorController.getDoctorById);
router.put("/doctors/:id", doctorController.updateDoctorById);
router.delete("/doctors/:id", doctorController.deleteDoctorById);
router.get("/doctors/username/:username", doctorController.getDoctorByUsername);
router.get("/specializations", doctorController.getSpecializations);
router.get(
  "/doctors/specialization/:specialization",
  doctorController.getDoctorsBySpecialization
);

module.exports = router;
