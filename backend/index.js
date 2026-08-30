import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";

import dbConnection from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import {
  initializeSocket,
} from "./config/socket.js";

const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

dbConnection();

app.use(express.json());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL?.split(",") ||
      true,
    credentials: true,
  })
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/worker",
  workerRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});