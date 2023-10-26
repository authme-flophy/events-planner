const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.DB_URI);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("login at /auth/login", () => {
  it("Should return success message", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "ericmaina.dev@gmail.com",
      password: "waikau123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
  }, 30000);
});
