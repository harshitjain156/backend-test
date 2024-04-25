const express = require("express");
const router = express.Router();
const {
  registerPharmacy,
  loginPharmacy,
} = require("../controllers/pharmacy.auth.controllers");

router.post("/register", registerPharmacy);
router.post("/login", loginPharmacy);

module.exports = router;
