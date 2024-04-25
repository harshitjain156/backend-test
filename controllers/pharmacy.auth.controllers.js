const { generateToken, sendResponseWithToken } = require("../utils/auth.utils");
const bcrypt = require("bcrypt");

const Pharmacy = require("../models/pharmacy.model");

exports.registerPharmacy = async (req, res) => {
  try {
    // Create new pharmacy
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();

    // Send response with token
    sendResponseWithToken(pharmacy, 201, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginPharmacy = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if pharmacy exists
    const pharmacy = await Pharmacy.findOne({ username });
    if (!pharmacy) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Send response with token
    sendResponseWithToken(pharmacy, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
