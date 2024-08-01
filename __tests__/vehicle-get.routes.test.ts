import request from "supertest";
import app from "../src/app";
import { generateToken } from "../src/auth/auth.middleware";

jest.mock("../src/repositories/vehicle.repository", () => {
  return {
    VehicleRepository: jest.fn().mockImplementation(() => {
      return {
        save: jest.fn().mockResolvedValue(null),
        list: jest.fn().mockResolvedValue([
          {
            _id: "60c72b2f4f1a4e3d8c8b4567",
            make: "Toyota",
            model: "Corolla",
            year: 2020,
            imageUrl: "https://example.com/image.jpg",
          },
        ]),
        find: jest.fn().mockImplementation((id) => {
          if (id === "60c72b2f4f1a4e3d8c8b4567") {
            return {
              _id: "60c72b2f4f1a4e3d8c8b4567",
              make: "Toyota",
              model: "Corolla",
              year: 2020,
              imageUrl: "https://example.com/image.jpg",
            };
          } else {
            return null; // Retorna null para IDs desconhecidos
          }
        }),
        update: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue(null),
        ensureCollectionInitialized: jest.fn().mockResolvedValue(null),
      };
    }),
  };
});

describe("Vehicle routes - GET", () => {
  const token = generateToken("frengee@mail.com");

  it("should list all vehicles", async () => {
    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("make", "Toyota");
    expect(response.body[0]).toHaveProperty("model", "Corolla");
    expect(response.body[0]).toHaveProperty("year", 2020);
    expect(response.body[0]).toHaveProperty(
      "imageUrl",
      "https://example.com/image.jpg"
    );
  });
});

describe("Vehicle routes - GET by ID", () => {
  const token = generateToken("frengee@mail.com");

  it("should get a vehicle by ID", async () => {
    const response = await request(app)
      .get("/api/vehicles/60c72b2f4f1a4e3d8c8b4567")
      .set("Authorization", `Bearer ${token}`);

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("make", "Toyota");
    expect(response.body).toHaveProperty("model", "Corolla");
    expect(response.body).toHaveProperty("year", 2020);
    expect(response.body).toHaveProperty(
      "imageUrl",
      "https://example.com/image.jpg"
    );
  });
});
