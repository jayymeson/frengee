// import request from "supertest";
// import app from "../src/app";
// import { generateToken } from "../src/auth/auth.middleware";
// import { connectDB, disconnectDB } from "../src/config/mongoose";

// beforeAll(async () => {
//   await connectDB();
// }, 30000);

// afterAll(async () => {
//   await disconnectDB();
// }, 30000);

// describe("Vehicle routes", () => {
//   it("should return 200 OK for GET /api/vehicles", async () => {
//     const token = generateToken("frengee@mail.com");
//     const response = await request(app)
//       .get("/api/vehicles")
//       .set("Authorization", `Bearer ${token}`);
//     expect(response.status).toBe(200);
//   }, 10000);
// });
