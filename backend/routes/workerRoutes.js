import { Router } from "express";

import {
  getWorkerStats,
  getWorkerTicket,
  getWorkerTickets,
  respondToRequest,
  sendWorkerMessage,
  updateWorkerTicket,
} from "../controller/workerController.js";

import {
  middlewareToProtect,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.use(middlewareToProtect);

router.get(
  "/dashboard/stats",
  getWorkerStats
);

router.get(
  "/tickets",
  getWorkerTickets
);

router.get(
  "/tickets/:id",
  getWorkerTicket
);

router.patch(
  "/tickets/:id/respond",
  respondToRequest
);

router.patch(
  "/tickets/:id",
  updateWorkerTicket
);

router.post(
  "/tickets/:id/messages",
  sendWorkerMessage
);

export default router;