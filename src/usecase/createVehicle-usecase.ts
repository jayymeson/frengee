import { Vehicle } from "../interfaces/vehicle.interface";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { CreateVehicleDTO } from "../dto/createVehicle.dto";
import { validate } from "class-validator";
import admin from "../config/firebase";

export class CreateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(
    vehicleDTO: CreateVehicleDTO,
    file: Express.Multer.File | undefined
  ): Promise<Vehicle> {
    console.log("Validating vehicle DTO:", vehicleDTO);
    const errors = await validate(vehicleDTO);
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      throw new Error(
        errors
          .map((err) => Object.values(err.constraints!).join(", "))
          .join(", ")
      );
    }

    if (!file) {
      console.error("No file uploaded");
      throw new Error("No imageUrl uploaded.");
    }

    const bucket = admin.storage().bucket();
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        reject(new Error(err.message));
      });

      blobStream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const vehicle: Vehicle = {
          make: vehicleDTO.make,
          model: vehicleDTO.model,
          year: vehicleDTO.year,
          imageUrl: publicUrl,
        };

        await this.vehicleRepository.save(vehicle);
        console.log("Vehicle saved to database:", vehicle);
        resolve(vehicle);
      });

      blobStream.end(file.buffer);
    });
  }
}
