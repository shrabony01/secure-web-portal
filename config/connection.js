import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// public DNS servers to ensure reliable MongoDB Atlas SRV resolution
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB database");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
