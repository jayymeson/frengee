import { VehicleRepository } from "../repositories/vehicle.repository";
import { ObjectId } from "mongodb";

export class DeleteVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const result = await this.vehicleRepository.delete(id);
    if (result.deletedCount === 0) {
      throw new Error("Vehicle not found");
    }
  }
}
