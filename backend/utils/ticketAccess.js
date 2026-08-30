import Ticket from "../models/Ticket.js";
import { isValidObjectId } from "./ticketConstants.js";

export const findTicket = async (id, populate = false) => {
  if (!isValidObjectId(id)) return null;

  const query = Ticket.findById(id);

  if (populate) {
    query
      .populate("customer", "name email")
      .populate(
        "assignedWorker",
        "name email serviceCategories ratingAverage ratingCount"
      );
  }

  return query;
};

export const isAssignedTo = (ticket, userId) =>
  Boolean(ticket.assignedWorker) &&
  ticket.assignedWorker.toString() === userId.toString();

export const ownsTicket = (ticket, userId) =>
  Boolean(ticket.customer) &&
  ticket.customer.toString() === userId.toString();

export const canAccessTicket = (ticket, user) => {
  if (!ticket || !user) return false;

  if (user.role === "admin") return true;

  if (user.role === "customer") {
    return ownsTicket(ticket, user._id);
  }

  if (user.role === "worker") {
    return isAssignedTo(ticket, user._id);
  }

  return false;
};