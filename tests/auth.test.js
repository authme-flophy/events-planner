const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("register at /auth/register", () => {
  it("Should return a success message", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "testuser@email.com",
      password: "testuser123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.header["token"]).toBeDefined();
  });

  it("Should return an error message", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "testuser@email.com",
      password: "testuser123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("An account associated with that email exists");
    expect(res.header["token"]).toBeUndefined();
  });
});

describe("login at /auth/login", () => {
  it("Should return success message", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@email.com",
      password: "testuser123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.header["token"]).toBeDefined();
  });

  it("Should return an error message", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuuser@gmail.com",
      password: "testuser123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email or Password is incorrect");
    expect(res.header["token"]).toBeUndefined();
  });

  it("Should return an error message", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@gmail.com",
      password: "teestuser123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email or Password is incorrect");
    expect(res.header["token"]).toBeUndefined();
  });
});
