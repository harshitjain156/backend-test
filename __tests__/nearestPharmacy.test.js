const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Pharmacy = require("../models/pharmacy.model");

describe("Nearest Pharmacy API", () => {
  let request;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);

    request = supertest(app);
  });

  beforeEach(async () => {
    await Pharmacy.deleteMany({});

    const mockPharmacy = new Pharmacy({
      username: "testpharmacy",
      password: "password123",
      address: "123 Test St, New York, NY",
      location: { type: "Point", coordinates: [-74.006, 40.7128] },
      phone: "123-456-7890",
      role: "Pharmacy",
    });
    await mockPharmacy.save();
  });

  afterEach(async () => {
    await Pharmacy.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /pharmacies/nearest should return nearest pharmacy", async () => {
    const response = await request
      .get("/pharmacies/nearest")
      .query({ lat: "40.7128", lng: "-74.0060" })
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );

    if (response.statusCode === 404) {
      console.log("No pharmacy found near the specified location");
    }

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.location.coordinates).toEqual([-74.006, 40.7128]);
  });
});
