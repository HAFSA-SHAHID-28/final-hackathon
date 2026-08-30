import express from "express";

import {
  createTicket,
  getCustomerTicketById,
  getCustomerTickets,
  getSuggestedWorkers,
  updateCustomerTicket,
  cancelTicket,
  createReview,
  sendCustomerMessage,
} from "../controller/ticketController.js";

import {
  middlewareToProtect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(middlewareToProtect);

router.post(
  "/",
  createTicket
);

router.get(
  "/suggested-workers",
  getSuggestedWorkers
);

router.get(
  "/my-tickets",
  getCustomerTickets
);

router.get(
  "/:id",
  getCustomerTicketById
);

router.patch(
  "/:id",
  updateCustomerTicket
);

router.patch(
  "/:id/cancel",
  cancelTicket
);

router.post(
  "/:id/messages",
  sendCustomerMessage
);

router.post(
  "/:id/review",
  createReview
);

export default router;