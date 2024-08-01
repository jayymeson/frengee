import request from "supertest";
import app from "../src/app";
import { generateToken } from "../src/auth/auth.middleware";

// Mock do VehicleRepository
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
        update: jest.fn().mockImplementation((vehicle) => {
          if (vehicle._id.toString() === "60c72b2f4f1a4e3d8c8b4567") {
            return { matchedCount: 1 };
          } else {
            return { matchedCount: 0 };
          }
        }),
        delete: jest.fn().mockImplementation((id) => {
          if (id === "60c72b2f4f1a4e3d8c8b4567") {
            return { deletedCount: 1 };
          } else {
            return { deletedCount: 0 };
          }
        }),
        ensureCollectionInitialized: jest.fn().mockResolvedValue(null),
      };
    }),
  };
});

describe("Vehicle routes - DELETE", () => {
  const token = generateToken("frengee@mail.com");

  it("should delete a vehicle by ID", async () => {
    const response = await request(app)
      .delete("/api/vehicles/60c72b2f4f1a4e3d8c8b4567")
      .set("Authorization", `Bearer ${token}`);

    console.log("Response status:", response.status);
    expect(response.status).toBe(204);
  });

  it("should return 404 if vehicle not found", async () => {
    const response = await request(app)
      .delete("/api/vehicles/60c72b2f4f1a4e3d8c8b4560") // ID válido mas inexistente
      .set("Authorization", `Bearer ${token}`);

    console.log("Response status:", response.status);
    expect(response.status).toBe(404);
  });

  it("should return 400 if ID is invalid", async () => {
    const response = await request(app)
      .delete("/api/vehicles/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    console.log("Response status:", response.status);
    expect(response.status).toBe(400);
  });
});
