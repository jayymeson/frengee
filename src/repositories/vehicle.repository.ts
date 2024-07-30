import { MongoClient, ObjectId, Db, Collection } from "mongodb";
import { VehicleRepositoryInterface } from "../interfaces/repository.interface";
import { Vehicle } from "../interfaces/vehicle.interface";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL as string;
if (!mongoUrl) {
  throw new Error("MONGO_URL environment variable is not defined");
}
const dbName = "vehicle_db";

export class VehicleRepository implements VehicleRepositoryInterface {
  private db: Db | undefined;
  private collection: Collection<Vehicle> | undefined;

  constructor() {
    this.connectToDb();
  }

  private async connectToDb(): Promise<void> {
    try {
      const client = await MongoClient.connect(mongoUrl);
      this.db = client.db(dbName);
      this.collection = this.db.collection<Vehicle>("vehicles");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
  }

  public async save(vehicle: Vehicle): Promise<void> {
    if (!this.collection) {
      throw new Error("Collection is not initialized");
    }
    await this.collection.insertOne(vehicle);
  }

  public async list(): Promise<Vehicle[]> {
    if (!this.collection) {
      throw new Error("Collection is not initialized");
    }
    return await this.collection.find().toArray();
  }

  public async find(id: string): Promise<Vehicle | null> {
    if (!this.collection) {
      throw new Error("Collection is not initialized");
    }
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async update(vehicle: Vehicle): Promise<void> {
    if (!this.collection) {
      throw new Error("Collection is not initialized");
    }
    await this.collection.updateOne(
      { _id: new ObjectId(vehicle._id) },
      { $set: vehicle }
    );
  }

  public async delete(id: string): Promise<void> {
    if (!this.collection) {
      throw new Error("Collection is not initialized");
    }
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}
