import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Routes/Routes.js";
import { connectDB } from "./Config/DB.js";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/invoices", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
