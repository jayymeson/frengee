import { Vehicle } from "../interfaces/vehicle.interface";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class ListVehiclesUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(): Promise<Vehicle[]> {
    return await this.vehicleRepository.list();
  }
}
