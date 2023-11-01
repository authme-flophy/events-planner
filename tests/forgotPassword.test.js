const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/user");
const emailService = require("../config/mail");
const crypto = require("crypto");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const user = new User({
    username: "test",
    email: "ericmaina.dev@gmail.com",
    password: "testuser123",
    resetPasswordToken: crypto
      .createHash("sha256")
      .update("hashedtoken")
      .digest("hex"),
    resetPasswordExpires: Date.now() + 1000 * 60 * 15,
  });

  await user.save();
});

afterEach(async () => {
  await User.deleteMany({});
});

jest.mock("../config/mail", () => {
  return {
    sendMail: jest.fn().mockImplementation((options, callback) => {
      callback(null, { info: "Email sent successfully" });
    }),
  };
});

test("It should send a reset password email", async () => {
  const res = await request(app).post("/auth/forgot-password").send({
    email: "ericmaina.dev@gmail.com",
  });

  expect(res.status).toBe(201);

  expect(res.body).toMatchObject({ message: "Password reset email sent" });

  // Check if the email service was called
  expect(emailService.sendMail).toHaveBeenCalled();
});

test("It should reset the password", async () => {
  const res = await request(app).post("/auth/reset-password/hashedtoken").send({
    newPassword: "newpassword",
  });

  expect(res.status).toBe(201);

  expect(res.body).toMatchObject({ message: "Password reset successful" });
});
