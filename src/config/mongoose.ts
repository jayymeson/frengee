import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error('MongoDB URL is not defined');
}

let mongoClient: mongoose.Mongoose | null = null;

export const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Skipping MongoDB connection for test environment');
    return;
  }
  if (mongoose.connection.readyState === 0) {
    try {
      mongoClient = await mongoose.connect(mongoUrl);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Skipping MongoDB disconnection for test environment');
    return;
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};
