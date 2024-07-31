import request from "supertest";
import app from "../src/app";
import { generateToken } from "../src/auth/auth.middleware";
import path from "path";

// Mock da conexão com o banco de dados
jest.mock("../src/config/mongoose", () => ({
  connectDB: jest.fn().mockResolvedValue(null),
  disconnectDB: jest.fn().mockResolvedValue(null),
}));

describe("Vehicle routes", () => {
  const token = generateToken("frengee@mail.com");

  it("should create a vehicle with valid data", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .field("make", "Toyota")
      .field("model", "Corolla")
      .field("year", 2020)
      .attach("imageUrl", path.join(__dirname, "../xei.png"));

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("make", "Toyota");
    expect(response.body).toHaveProperty("model", "Corolla");
    expect(response.body).toHaveProperty("year", 2020);
    expect(response.body).toHaveProperty(
      "imageUrl",
      expect.stringContaining("https://storage.googleapis.com/")
    );
  });

  it("should not create a vehicle without make", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .field("model", "Corolla")
      .field("year", 2020)
      .field("imageUrl", "https://example.com/image.jpg");

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('"make" is required');
  });

  it("should not create a vehicle without model", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .field("make", "Toyota")
      .field("year", 2020)
      .field("imageUrl", "https://example.com/image.jpg");

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('"model" is required');
  });

  it("should not create a vehicle without year", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .field("make", "Toyota")
      .field("model", "Corolla")
      .field("imageUrl", "https://example.com/image.jpg");

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('"year" is required');
  });

  it("should not create a vehicle without imageUrl", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .field("make", "Toyota")
      .field("model", "Corolla")
      .field("year", 2020);

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No imageUrl uploaded.");
  });

  it("should require authentication to create a vehicle", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .field("make", "Toyota")
      .field("model", "Corolla")
      .field("year", 2020)
      .field("imageUrl", "https://example.com/image.jpg");

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(401);
  });
});
