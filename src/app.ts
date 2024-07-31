import express from "express";
import vehicleRoutes from "./routes/vehicle.routes";
import { setupSwagger } from "./config/swagger";
import mongoose from "./config/mongoose";
import dotenv from "dotenv";
import authRoutes from "./auth/auth.routes";
import admin from "./config/firebase";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", vehicleRoutes);
app.use("/auth", authRoutes);

setupSwagger(app);

mongoose;
admin;

export default app;
