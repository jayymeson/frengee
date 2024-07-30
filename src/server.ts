import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import admin from "./config/firebase";

dotenv.config();

const port = process.env.PORT || 3017;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});