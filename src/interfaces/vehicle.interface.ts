import { ObjectId } from "mongodb";

export interface Vehicle {
  _id?: ObjectId;
  make: string;
  model: string;
  year: number;
  imageUrl: string;
}
