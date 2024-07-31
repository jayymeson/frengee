process.env.NODE_ENV = 'test';
import { connectDB, disconnectDB } from '../src/config/mongoose';

beforeAll(async () => {
  await connectDB();
}, 30000);

afterAll(async () => {
  await disconnectDB();
}, 30000);
