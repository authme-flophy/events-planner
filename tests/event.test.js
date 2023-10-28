const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const eventControllers = require("../controllers/eventControllers");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const Event = require("../models/event");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // creating a new user and a token, for authorization and relationship purposes
  const userData = {
    username: "testuser",
    email: "testuser@email.com",
    password: "testuser123",
  };

  const user = new User(userData);

  const newUser = await user.save();

  userId = newUser._id.toString();

  const payload = {
    user: {
      id: newUser._id,
    },
  };

  token = jwt.sign(payload, process.env.SECRET_CODE);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Should create a new event", () => {
  it("Should return the created event", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", token)
      .send({
        title: "Test Event Title",
        description: "Test Event Description",
        date: "2023-11-01T17:00:00+03:00",
        location: "Test Event Location",
        creator: userId,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toBeTruthy();
  });
});

describe("retrieve all events", () => {
  it("Should return a list of all events", async () => {
    const res = await request(app).get("/events").set("Authorization", token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  });
});

describe("Update Event API Endpoint", () => {
  let eventId;

  beforeAll(async () => {
    const event = new Event({
      title: "Test Event Title",
      description: "Test Event Description",
      date: "2023-11-01T17:00:00+03:00",
      location: "Test Event Location",
      creator: userId,
    });

    const newEvent = await event.save();

    eventId = newEvent._id.toString();
  });

  it("Should update an existing event", async () => {
    const req = {
      params: {
        id: eventId,
      },
      body: {
        title: "Test Event Title (updated)",
        description: "Test Event Description",
        date: "2023-11-01T17:00:00+03:00",
        location: "Test Event Location",
        creator: userId,
      },
      userId: userId,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eventControllers.event_update(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("Should delete an existing event", async () => {
    const req = {
      params: {
        id: eventId,
      },
      userId,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eventControllers.event_delete(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
