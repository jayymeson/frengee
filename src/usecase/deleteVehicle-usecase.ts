import { VehicleRepository } from "../repositories/vehicle.repository";

export class DeleteVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
