import request from "supertest";
import app from "../src/app";
import { generateToken } from "../src/auth/auth.middleware";
import mongoose from "mongoose";

// Mock da conexão com o banco de dados
jest.mock("../src/config/mongoose", () => ({
  connectDB: jest.fn().mockResolvedValue(null),
  disconnectDB: jest.fn().mockResolvedValue(null),
}));

describe("Auth Controller", () => {
  beforeAll(async () => {
    await require("../src/config/mongoose").connectDB();
  });

  afterAll(async () => {
    await require("../src/config/mongoose").disconnectDB();
  });

  describe("POST /auth/login", () => {
    it("should authenticate user and return a token when credentials are correct", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "frengee@mail.com",
        password: "Abcd1234*",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");

      const decodedToken = generateToken("frengee@mail.com");
      expect(decodedToken).toBeTruthy();
    });

    it("should return 401 when credentials are incorrect", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "wrong@email.com",
        password: "WrongPassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Invalid email or password" });
    });
  });
});
