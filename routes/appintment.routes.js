const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointment.controller");

router.post("/appointments", appointmentController.createAppointment);
router.get(
  "/appointments/doctor/:doctorId",
  appointmentController.getAppointmentsByDoctorId
);
router.get("/appointments/:id", appointmentController.getAppointmentById);
router.put("/appointments/:id", appointmentController.updateAppointmentById);
router.delete("/appointments/:id", appointmentController.deleteAppointmentById);
router.get(
  "/appointments/patient/:patientId",
  appointmentController.getAppointmentsByPatientId
);

module.exports = router;
