const supertest = require("supertest");
const app = require("../index"); // Adjust the path to your server's entry point
const mongoose = require("mongoose");
const Medicine = require("../models/medicine.model"); // Adjust the path to your Medicine model

describe("Delete Medicine API", () => {
  let request;
  let medicineId;
  let pharmacyId = "65b72b16a6d668b954b89dc3";

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);
    request = supertest(app);
  });

  beforeEach(async () => {
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
    medicineId = savedMedicine._id.toString();
  });

  afterEach(async () => {
    await Medicine.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("DELETE /medicines/bypharmacy/:medicineId/:pharmacyId should delete medicine", async () => {
    const response = await request
      .delete(`/medicines/bypharmacy/${medicineId}/${pharmacyId}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );

    expect(response.statusCode).toBe(204);

    const deletedMedicine = await Medicine.findById(medicineId);
    expect(deletedMedicine).toBeNull();
  });
});
