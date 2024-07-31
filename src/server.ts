import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 3017;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
