import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routes/Routes.ts";
import { connectDB } from "./Config/DB.ts";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
