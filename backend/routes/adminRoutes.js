import { Router } from "express";

import { middlewareToProtect } from "../middlewares/authMiddleware.js";

import {
  getUsers,
  getDashboardStats,
  getAllTickets,
  getTicketById,
  getWorkerOverview,
} from "../controller/adminController.js";

const router = Router();

router.use(middlewareToProtect);

// =========================================================
// ADMIN DASHBOARD
// =========================================================

router.get("/dashboard/stats", getDashboardStats);

// =========================================================
// USERS
// =========================================================

router.get("/users", getUsers);

// =========================================================
// COMPLAINTS / TICKETS
// =========================================================

router.get("/tickets", getAllTickets);

router.get("/tickets/:ticketId", getTicketById);

// =========================================================
// WORKER OVERVIEW
// =========================================================

router.get("/workers/:workerId", getWorkerOverview);

export default router;