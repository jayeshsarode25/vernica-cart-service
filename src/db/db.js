import mongoose from "mongoose";
import config from "../config/config.js";

async function connectDb() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}


export default connectDb;
