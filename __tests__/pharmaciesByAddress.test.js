const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Pharmacy = require("../models/pharmacy.model");

describe("Pharmacies By Address API", () => {
  let request;
  let address = "Bekaa, Lebanon";
  let pharmacy;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);

    request = supertest(app);
  });

  beforeEach(async () => {
    // Seed the database with a pharmacy
    pharmacy = new Pharmacy({
      username: "pharmacy1",
      password: "password123",
      address: address,
      location: {
        type: "Point",
        coordinates: [-74.006, 40.7128],
      },
      phone: "123-456-7890",
      // Add other necessary fields
    });
    await pharmacy.save();
  });

  afterEach(async () => {
    await Pharmacy.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /pharmacies/address/:address should return pharmacies by address", async () => {
    const response = await request
      .get(`/pharmacies/address/${address}`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty("_id");
    expect(response.body[0].address).toBe(address);
  });
});
