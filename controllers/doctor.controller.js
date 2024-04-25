const Doctor = require("./../models/doctor.model");

// Create a new doctor
const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    doctor.profilePicture = req.file.path;
    await doctor.save();
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecializations = async (req, res) => {
  try {
    const specializationsEnum = Doctor.schema.path("specialization").enumValues;
    res.json(specializationsEnum);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDoctorsBySpecialization = async (req, res) => {
  try {
    const specialization = req.params.specialization;
    const doctors = await Doctor.find({ specialization: specialization });
    res.json(doctors);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving doctors.",
    });
  }
};

// Update a doctor by ID
const updateDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const updateData = req.body;
    if (updateData.username) doctor.username = updateData.username;
    if (updateData.password) doctor.password = updateData.password;
    if (updateData.firstName) doctor.firstName = updateData.firstName;
    if (updateData.lastName) doctor.lastName = updateData.lastName;
    if (updateData.email) doctor.email = updateData.email;
    if (updateData.phone) doctor.phone = updateData.phone;
    if (updateData.gender) doctor.gender = updateData.gender;
    if (updateData.specialization)
      doctor.specialization = updateData.specialization;
    if (updateData.yearsOfExperience)
      doctor.yearsOfExperience = updateData.yearsOfExperience;
    if (updateData.appointmentPrice)
      doctor.appointmentPrice = updateData.appointmentPrice;
    if (updateData.timing) doctor.timing = updateData.timing;

    const updatedDoctor = await doctor.save();

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a doctor by ID
const deleteDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(204).json({ message: "Doctor Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get doctor by username
const getDoctorByUsername = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ username: req.params.username });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

const getAIDrivenRecommendation = async (req, res) => {
  const symptoms = req.body.symptoms;

  const prompt =
    `Patient has reported the following symptoms: ${symptoms}\n\n` +
    `Possible Reasons:\n` +
    `[Provide two lines of possible non-sensitive reasons based on the symptoms.]\n\n` +
    `Recommendation:\n` +
    `[Please offer a short paragraph of general advice and recommendations for the symptoms without suggesting specific medications or treatments.]\n\n` +
    `Recommended Specialzation:\n` +
    `[Please suggest only one medical specialization to consult. Choose one from the following list based on the symptoms logged: ",
    "Gastroenterology",
    "General Surgery",
    "Internal Medicine",
    "Neurology",
    "Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Urology",
    "Dermatology",
    "Emergency Medicine",
    "Anesthesiology",
    "Endocrinology",
    "Nephrology",
    "Rheumatology",]`;

  try {
    const aiResult = await aiModel.generateContent(prompt);
    const aiResponse = await aiResult.response;
    let aiText = await aiResponse.text();

    res.status(200).json({ aiText: aiText });
  } catch (error) {
    console.error("Error during AI-driven recommendation:", error);
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  getSpecializations,
  getDoctorsBySpecialization,
  getDoctorByUsername,
  getAIDrivenRecommendation,
  uploadProfilePicture,
};
