const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Prescription = require("../models/prescription.model");

describe("Create Prescription API", () => {
  let request;

  const mockPrescriptionData = {
    patientId: "658b432bdac84f9b4ce8a5d2",
    doctorId: "658b079e2c32d83e08583937",
    medicineName: "Paracetamol",
    dosageInstructions: "Take one tablet every 6 hours",
  };

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);
    request = supertest(app);
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Prescription.deleteMany({});
  });

  test("POST /prescriptions should create a prescription", async () => {
    const response = await request
      .post("/prescriptions")
      .send(mockPrescriptionData)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.patientId).toBe(mockPrescriptionData.patientId);
    expect(response.body.doctorId).toBe(mockPrescriptionData.doctorId);
    expect(response.body.medicineName).toBe(mockPrescriptionData.medicineName);
  });
});
