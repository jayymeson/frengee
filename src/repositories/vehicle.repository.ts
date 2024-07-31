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
  private client: MongoClient | undefined;

  constructor() {
    this.connectToDb()
      .then(() => {
        console.log("Database connected and collection initialized");
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
      });
  }

  private async connectToDb(): Promise<void> {
    try {
      this.client = await MongoClient.connect(mongoUrl);
      this.db = this.client.db(dbName);
      this.collection = this.db.collection<Vehicle>("vehicles");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
  }

  public async save(vehicle: Vehicle): Promise<void> {
    await this.ensureCollectionInitialized();
    await this.collection!.insertOne(vehicle);
  }

  public async list(): Promise<Vehicle[]> {
    await this.ensureCollectionInitialized();
    return await this.collection!.find().toArray();
  }

  public async find(id: string): Promise<Vehicle | null> {
    await this.ensureCollectionInitialized();
    return await this.collection!.findOne({ _id: new ObjectId(id) });
  }

  public async update(vehicle: Vehicle): Promise<void> {
    await this.ensureCollectionInitialized();
    await this.collection!.updateOne(
      { _id: new ObjectId(vehicle._id) },
      { $set: vehicle }
    );
  }

  public async delete(id: string): Promise<void> {
    await this.ensureCollectionInitialized();
    await this.collection!.deleteOne({ _id: new ObjectId(id) });
  }

  private async ensureCollectionInitialized(): Promise<void> {
    if (!this.collection) {
      await this.connectToDb();
    }
  }
}
