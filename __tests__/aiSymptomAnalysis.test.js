const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Doctor = require("../models/doctor.model");

const mockSymptoms = {
  symptoms: "Cough, fever, headache",
};

describe("AI Symptom Analysis API", () => {
  let request;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);

    request = supertest(app);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("POST /ai-symptom-analysis should return AI-driven recommendation", async () => {
    const response = await request
      .post("/ai-symptom-analysis")
      .send(mockSymptoms)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      ); // Replace with a valid token

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("aiText");
  }, 10000);
});
