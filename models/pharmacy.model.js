const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const pharmacySchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Pharmacy",
  },
});

pharmacySchema.pre(
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

pharmacySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Pharmacy", pharmacySchema);
