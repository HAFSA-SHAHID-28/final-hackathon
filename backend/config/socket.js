import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL?.split(",") || "*",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        throw new Error("Authentication required");
      }

      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(id).select("_id role status");

      if (!user || user.status === "block") {
        throw new Error("Unauthorized");
      }

      socket.user = user;

      next();
    } catch {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // Personal room
    socket.join(`user:${userId}`);

    // All workers room
    if (socket.user.role === "worker") {
      socket.join("workers");
    }

    socket.on("ticket:join", async (ticketId, acknowledge = () => {}) => {
      try {
        if (!/^[a-fA-F0-9]{24}$/.test(ticketId)) {
          return acknowledge({
            success: false,
            message: "Invalid ticket ID",
          });
        }

        const ticket = await Ticket.findById(ticketId).select(
          "customer assignedWorker"
        );

        if (!ticket) {
          return acknowledge({
            success: false,
            message: "Ticket not found",
          });
        }

        const isCustomer =
          ticket.customer?.toString() === userId;

        const isAssignedWorker =
          ticket.assignedWorker?.toString() === userId;

        const isAdmin = socket.user.role === "admin";

        const allowed =
          isCustomer ||
          isAssignedWorker ||
          isAdmin;

        if (!allowed) {
          return acknowledge({
            success: false,
            message: "You are not allowed to access this ticket",
          });
        }

        socket.join(`ticket:${ticketId}`);

        return acknowledge({
          success: true,
        });
      } catch (error) {
        console.error("Socket ticket join error:", error);

        return acknowledge({
          success: false,
          message: "Unable to join ticket",
        });
      }
    });

    socket.on("ticket:leave", (ticketId) => {
      if (/^[a-fA-F0-9]{24}$/.test(ticketId)) {
        socket.leave(`ticket:${ticketId}`);
      }
    });
  });

  return io;
};

export const getIO = () => io;