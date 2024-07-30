import { Vehicle } from "../interfaces/vehicle.interface";
import { CreateVehicleDTO } from "../dto/createVehicle.dto";
import { VehicleRepository } from "../repositories/vehicle.repository";

export class CreateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(vehicleDTO: CreateVehicleDTO): Promise<Vehicle> {
    const vehicle: Vehicle = {
      make: vehicleDTO.make,
      model: vehicleDTO.model,
      year: vehicleDTO.year,
    };
    await this.vehicleRepository.save(vehicle);
    return vehicle;
  }
}
