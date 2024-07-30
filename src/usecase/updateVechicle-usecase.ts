import { Vehicle } from "../interfaces/vehicle.interface";
import { ObjectId } from "mongodb";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class UpdateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string, vehicleData: Partial<Vehicle>): Promise<void> {
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

    await this.vehicleRepository.update(vehicleToUpdate as Vehicle);
  }
}
