const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const payload = {
    user: {
      id: 1234567,
    },
  };

  token = jwt.sign(payload, process.env.SECRET_CODE);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("retrieve all events", () => {
  it("Should return a list of all events", async () => {
    const res = await request(app).get("/events").set("Authorization", token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
