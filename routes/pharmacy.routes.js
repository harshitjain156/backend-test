const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/pharmacy.controller");
const { pharmacyMiddleware } = require("../middleware/pharmacy.middleware.js");

router.get("/pharmacies/nearest", pharmacyController.getNearestPharmacy);
router.post("/pharmacies", pharmacyController.createPharmacy);
router.get("/pharmacies", pharmacyController.getAllPharmacies);
router.put("/pharmacies/:id", pharmacyController.updatePharmacyById);
router.delete("/pharmacies/:id", pharmacyController.deletePharmacyById);
router.get(
  "/pharmacies/username/:username",
  pharmacyController.getPharmacyByUsername
);
router.get(
  "/pharmacies/address/:address",
  pharmacyController.getPharmaciesByAddress
);
router.get("/pharmacies/:id", pharmacyController.getPharmacyById);

module.exports = router;
