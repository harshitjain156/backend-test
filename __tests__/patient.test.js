const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Patient = require("../models/patient.model");

// Mock data for testing
const mockPatientData = {
  username: "testpatient",
  password: "password123",
  firstName: "Test",
  lastName: "Patient",
  email: "testpatient@example.com",
  address: "123 Test St",
  phone: "123-456-7890",
  dateOfBirth: new Date("1990-01-01"),
  gender: "Male",
};

describe("Patient API", () => {
  let request;
  let patientId;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);

    request = supertest(app);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Seed the database with mock data
    const patient = new Patient(mockPatientData);
    const savedPatient = await patient.save();
    patientId = savedPatient._id;
  });

  afterEach(async () => {
    // Clear the database after each test
    await Patient.deleteMany({});
  });

  //   test("GET /patients should return data", async () => {
  //     const response = await request
  //       .get("/patients")
  //       .set(
  //         "Authorization",
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
  //       ); // Replace with a valid token
  //     expect(response.statusCode).toBe(200);
  //     expect(Array.isArray(response.body)).toBeTruthy();
  //     expect(response.body.length).toBe(1);
  //     expect(response.body[0]._id.toString()).toBe(patientId.toString());
  //   });

  //   test("GET /patients/:id should return a patient", async () => {
  //     const response = await request
  //       .get(`/patients/${patientId}`)
  //       .set(
  //         "Authorization",
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
  //       );
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toHaveProperty("_id", patientId.toString());
  //   });

  test("POST /patients should create a new patient", async () => {
    const newPatient = {
      ...mockPatientData,
      username: "newtestpatient",
      email: "newtestpatient@example.com",
    };
    const response = await request
      .post("/patients")
      .send(newPatient)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  //   test("PUT /patients/:id should update a patient", async () => {
  //     const newEmail = "updatedtestpatient@example.com";
  //     const response = await request
  //       .put(`/patients/${patientId}`)
  //       .send({ email: newEmail })
  //       .set(
  //         "Authorization",
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
  //       );
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.email).toBe(newEmail);
  //   });

  test("DELETE /patients/:id should delete a patient", async () => {
    const response = await request
      .delete(`/patients/${patientId}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );
    expect(response.statusCode).toBe(200);
    const findDeletedPatient = await Patient.findById(patientId);
    expect(findDeletedPatient).toBeNull();
  });
});
