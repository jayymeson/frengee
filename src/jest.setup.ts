process.env.NODE_ENV = 'test';

beforeAll(async () => {
  const { connectDB } = await import('../src/config/mongoose');
  await connectDB();
}, 30000);

afterAll(async () => {
  const { disconnectDB } = await import('../src/config/mongoose');
  await disconnectDB();
}, 30000);
