import mongoose from "mongoose";

export const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("Access to the DataBase Granted");
  } catch (error) {
    console.error("Failed to connect to the DataBase", error);
  }
};
