const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Prescription = require("../models/prescription.model");
const Patient = require("../models/patient.model");

describe("Prescriptions By Patient ID API", () => {
  let request;
  let patientId;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);

    request = supertest(app);
  });

  beforeEach(async () => {
    const patient = new Patient({
      username: "emmagreen",
      password: "password123",
      firstName: "Emma",
      lastName: "Green",
      email: "emmagreen@example.com",
      address: "789 Pine Road, Lakeside, LN",
      phone: "555-4321",
      dateOfBirth: "1985-05-15",
      gender: "Female",
      additionalInfo: {
        allergies: "Aspirin",
        medicalHistory: "Diabetes",
      },
      role: "Patient",
    });
    const savedPatient = await patient.save();
    patientId = savedPatient._id;

    const prescription = new Prescription({
      patientId: patientId,
      doctorId: "658b079e2c32d83e08583937",
      medicineName: "Test Medicine",
      dosageInstructions: "Test Dosage Instructions",
    });

    await prescription.save();
  });

  afterEach(async () => {
    await Prescription.deleteMany({});
    await Patient.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /prescriptions/patient/:patientId should return prescriptions", async () => {
    const response = await request
      .get(`/prescriptions/patient/${patientId}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(
      response.body.some(
        (prescription) => prescription.patientId === patientId.toString()
      )
    ).toBeTruthy();
  });
});
