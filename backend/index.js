import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";

import dbConnection from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { initializeSocket } from "./config/socket.js";

const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;


// ================= DATABASE =================

dbConnection();


// ================= CORS =================

const allowedOrigins = [
  "https://verdant-noir.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ================= BODY PARSER =================

app.use(express.json());


// ================= ROUTES =================

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


// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});


// ================= SOCKET.IO =================

initializeSocket(server);


// ================= SERVER =================

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});