import { Vehicle } from "./vehicle.interface";

export interface VehicleRepositoryInterface {
  save(vehicle: Vehicle): Promise<void>;
  list(): Promise<Vehicle[]>;
  update(vehicle: Vehicle): Promise<void>;
  find(id: string): Promise<Vehicle | null>;
  delete(id: string): Promise<void>;
}
