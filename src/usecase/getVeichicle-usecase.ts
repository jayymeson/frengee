import { Vehicle } from "../interfaces/vehicle.interface";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class GetVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<Vehicle | null> {
    return await this.vehicleRepository.find(id);
  }
}
