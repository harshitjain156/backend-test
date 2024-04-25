const Appointment = require("./../models/appointment.model");

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all appointments by patientId
const getAppointmentsByPatientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all appointments by doctorId
const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an appointment by ID
const updateAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an appointment by ID
const deleteAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(204).json({ message: "Pharmacy Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
};
