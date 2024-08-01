import { Vehicle } from "../interfaces/vehicle.interface";
import { ObjectId } from "mongodb";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class UpdateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string, vehicleData: Partial<Vehicle>): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const vehicle: Partial<Vehicle> = {
      _id: new ObjectId(id),
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      imageUrl: vehicleData.imageUrl,
    };

    const vehicleToUpdate: any = Object.fromEntries(
      Object.entries(vehicle).filter(([_, v]) => v !== undefined)
    );

    const result = await this.vehicleRepository.update(
      vehicleToUpdate as Vehicle
    );
    if (result.matchedCount === 0) {
      throw new Error("Vehicle not found");
    }
  }
}
