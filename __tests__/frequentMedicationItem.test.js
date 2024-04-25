const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); // Adjust this to the correct path of your app's entry point
const Pharmacy = require("../models/pharmacy.model"); // Adjust the path to your Pharmacy model
const MedicationOrder = require("../models/medication.order.model"); // Adjust the path to your MedicationOrder model
const Medicine = require("../models/medicine.model"); // Adjust the path to your Medicine model

describe("Frequent Medication Item API", () => {
  let request;
  let pharmacyId;
  let medicationOrderId;
  let medicineId;

  beforeAll(async () => {
    request = supertest(app);
    await mongoose.connect(process.env.MONGODB_URI);

    // Create mock data for Pharmacy
    const pharmacy = new Pharmacy({
      username: "countrypharmacy",
      password: "password123",
      address: "123 City Avenue, Metro, MT",
      location: {
        type: "Point",
        coordinates: [-122.42, 37.77],
      },
      phone: "555-1212",
      role: "Pharmacy",
    });
    const savedPharmacy = await pharmacy.save();
    pharmacyId = savedPharmacy._id;

    const medicine = new Medicine({
      pharmacyId: pharmacyId,
      medicineDetails: [
        {
          name: "Ibuprofen",
          description: "Used to reduce inflammation and pain",
          sideEffects: "Upset stomach, drowsiness",
          group: "Nonsteroidal Anti-Inflammatory Drug (NSAID)",
        },
      ],
      stockLevel: 150,
      price: 8,
    });
    const savedMedicine = await medicine.save();
    medicineId = savedMedicine._id;

    const medicationOrder = new MedicationOrder({
      pharmacyId: pharmacyId,
      medicineId: medicineId,
      patientId: "60d0fe4f5311236168a109ca",
    });
    const savedMedicationOrder = await medicationOrder.save();
    medicationOrderId = savedMedicationOrder._id;
  });

  afterAll(async () => {
    // Clean up mock data
    await MedicationOrder.deleteMany({});
    await Medicine.deleteMany({});
    await Pharmacy.deleteMany({});
    await mongoose.connection.close();
  });

  test("GET /medication-orders/frequentItem/:pharmacyId should return frequent item", async () => {
    const response = await request
      .get(`/medication-orders/frequentItem/${pharmacyId}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      ); // Replace with a valid token

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name");
  });
});
