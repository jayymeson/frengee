import mongoose from './config/mongoose';
import express from 'express';
import vehicleRoutes from './routes/vehicle.routes';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(express.json());
app.use('/api', vehicleRoutes);

setupSwagger(app);

export default app;