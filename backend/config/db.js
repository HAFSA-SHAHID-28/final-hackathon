import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STR);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default dbConnection;