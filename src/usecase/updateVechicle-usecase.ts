import { Vehicle } from "../interfaces/vehicle.interface";
import { ObjectId } from "mongodb";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class UpdateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string, vehicleData: Partial<Vehicle>): Promise<void> {
    const vehicle: Vehicle = {
      _id: new ObjectId(id),
      make: vehicleData.make ?? "",
      model: vehicleData.model ?? "",
      year: vehicleData.year ?? 0,
    };
    await this.vehicleRepository.update(vehicle);
  }
}
