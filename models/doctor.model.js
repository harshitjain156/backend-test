const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Female", "Male"],
  },
  specialization: {
    type: String,
    required: true,
    enum: [
      "Cardiology",
      "Gastroenterology",
      "Internal Medicine",
      "Neurology",
      "Gynecology",
      "Oncology",
      "Ophthalmology",
      "Orthopedics",
      "Pediatrics",
      "Psychiatry",
      "Pulmonology",
      "General Surgery",
      "Radiology",
      "Urology",
      "Dermatology",
      "Emergency Medicine",
      "Anesthesiology",
      "Endocrinology",
      "Nephrology",
      "Rheumatology",
    ],
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  appointmentPrice: {
    type: Number,
    required: true,
  },
  timing: {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    daysOfOperation: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "Doctor",
  },
  profilePicture: {
    type: String,
    default:
      "https://www.vhv.rs/dpng/d/315-3159706_doctor-with-stethoscope-png-png-download-transparent-background.png",
  },
});

doctorSchema.pre(
  "save",
  async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
