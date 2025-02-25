const express = require("express");
const request = require("supertest");

const {
  register,
  login,
  logout,
  getConnections,
  requestReceived,
  getFeed,
} = require("../controller/user.controller");
const { UserModel } = require("../databases/models/user.model");
const { compare } = require("bcryptjs");

const app = express();
app.use(express.json());

app.use("/user/register", register);
app.use("/user/login", login);
app.use("/user/logout", logout);

jest.mock("../databases/models/user.model.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Routes", () => {
  describe("POST /user/register", () => {
    it("should return 201", async () => {
      const res = await request(app)
        .post("/user/register")
        .send({
          name: "John Doe",
          email: "johndoe@gmail.com",
          password: "Johndoe@123",
          photoUrl:
            "https://unsplash.com/photos/black-framed-eyeglasses-MoDcnVRN5JU",
          species: "Dog",
          interestedIn: ["Dog", "Cat", "Bird", "Fish", "Reptile", "Other"],
          lookingFor: "Long Term",
          interests: ["Playing", "Eating", "Sleeping"],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("User registered successfully");
    });
  });

  describe("POST /user/login", () => {
    it("should return 200", async () => {
      UserModel.findOne.mockResolvedValue({
        email: "nimo@gmail.com",
        password: "$2a$10$somethinghashed",
        comparePassword: jest.fn().mockResolvedValue(true),
        getJWT: jest.fn().mockResolvedValue("fake-jwt-token"),
      });
      const res = await request(app)
        .post("/user/login")
        .send({ email: "nimo@gmail.com", password: "Nimo@1234" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Logged in successfully');
      
    });
  });
});
