import express from "express";
import "dotenv/config";
import cors from "cors";

import dbConnection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

dbConnection();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});