import app from "./app";
import { connectDB } from "./config/mongoose";

const port = process.env.PORT || 3017;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
