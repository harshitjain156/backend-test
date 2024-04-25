const supertest = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Chat = require("../models/chat.model");

// Mock data for testing chat creation
const mockChatData = {
  patientId: "658b432bdac84f9b4ce8a5d2",
  doctorId: "658b079e2c32d83e08583937",
  messages: [
    {
      senderId: "658b432bdac84f9b4ce8a5d2",
      receiverId: "658b079e2c32d83e08583937",
      content: "Hello, this is a test message",
    },
  ],
};

describe("Chat API", () => {
  let request;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoose.connect(process.env.MONGODB_URI);
    request = supertest(app);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Chat.deleteMany({});
  });

  test("POST /chats should create a new chat", async () => {
    const response = await request
      .post("/chats")
      .send(mockChatData)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjcxOTVhNWUyNjRhMWJlOThlMWRkMiIsInJvbGUiOiJQYXRpZW50IiwiaWF0IjoxNzA2NDk4NDQxLCJleHAiOjE3MDY1ODQ4NDF9.PEFBtTyMoCLQegnM0GuJrIeipTVE3xVBRf_sPMYNxi8"
      );
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.patientId).toBe(mockChatData.patientId);
    expect(response.body.doctorId).toBe(mockChatData.doctorId);
    expect(Array.isArray(response.body.messages)).toBeTruthy();
  });
});
