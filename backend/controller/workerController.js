import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";

import {
  findTicket,
  isAssignedTo,
} from "../utils/ticketAccess.js";

import {
  TERMINAL_TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
  isValidWorkerStatusTransition,
} from "../utils/ticketConstants.js";

import { getIO } from "../config/socket.js";
import {
  emitMessageCreated,
  emitTicketUpdate,
} from "../utils/socketEvents.js";

const workerOnly = (req, res) => {
  if (req.user.role === "worker") {
    return true;
  }

  res.status(403).json({
    success: false,
    message: "Worker access required.",
  });

  return false;
};

const getOwned = async (id, user) => {
  const ticket = await findTicket(id);

  if (!ticket) return null;

  return isAssignedTo(ticket, user._id)
    ? ticket
    : null;
};

export const getWorkerTickets = async (req, res) => {
  try {
    if (!workerOnly(req, res)) return;

    const filter = {
      assignedWorker: req.user._id,
    };

    if (req.query.status) {
      const validStatuses = [
        "Pending",
        "Accepted",
        "In Progress",
        "Completed",
        "Rejected",
        "Cancelled",
      ];

      if (validStatuses.includes(req.query.status)) {
        filter.status = req.query.status;
      }
    }

    const tickets = await Ticket.find(filter)
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Get worker tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch requests.",
    });
  }
};

export const getWorkerTicket = async (req, res) => {
  try {
    if (!workerOnly(req, res)) return;

    const ticket = await getOwned(
      req.params.id,
      req.user
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    const messages = await Message.find({
      ticket: ticket._id,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      ticket,
      messages,
    });
  } catch (error) {
    console.error("Get worker ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch ticket.",
    });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    if (!workerOnly(req, res)) return;

    const ticket = await getOwned(
      req.params.id,
      req.user
    );

    const {
      decision,
      rejectionReason = "",
    } = req.body;

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    if (ticket.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending requests can be accepted or rejected.",
      });
    }

    if (!["accept", "reject"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message:
          "Decision must be accept or reject.",
      });
    }

    if (
      typeof rejectionReason !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rejection reason must be text.",
      });
    }

    if (rejectionReason.length > 3000) {
      return res.status(400).json({
        success: false,
        message:
          "Rejection reason must be 3000 characters or fewer.",
      });
    }

    if (
      decision === "reject" &&
      !rejectionReason.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A rejection reason is required.",
      });
    }

    ticket.status =
      decision === "accept"
        ? "Accepted"
        : "Rejected";

    ticket.rejectionReason =
      decision === "reject"
        ? rejectionReason.trim()
        : "";

    await ticket.save();

    emitTicketUpdate(getIO(), ticket);

    return res.json({
      success: true,
      message:
        decision === "accept"
          ? "Request accepted."
          : "Request rejected.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Respond to request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update request.",
    });
  }
};

export const updateWorkerTicket = async (
  req,
  res
) => {
  try {
    if (!workerOnly(req, res)) return;

    const ticket = await getOwned(
      req.params.id,
      req.user
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    if (
      TERMINAL_TICKET_STATUSES.includes(
        ticket.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed, rejected, or cancelled requests cannot be updated.",
      });
    }

    const {
      priority,
      status,
      completionNote,
      category,
      aiSummary,
    } = req.body;

    if (
      priority !== undefined &&
      !TICKET_PRIORITIES.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority.",
      });
    }

    if (
      category !== undefined &&
      !TICKET_CATEGORIES.includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category.",
      });
    }

    if (status !== undefined) {
      if (
        !isValidWorkerStatusTransition(
          ticket.status,
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from "${ticket.status}" to "${status}".`,
        });
      }
    }

    if (
      status === "Completed" &&
      !String(
        completionNote || ticket.completionNote
      ).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completion note is required.",
      });
    }

    if (
      aiSummary !== undefined &&
      (
        typeof aiSummary !== "string" ||
        aiSummary.trim().length > 300
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "AI summary must be 300 characters or fewer.",
      });
    }

    if (
      completionNote !== undefined &&
      (
        typeof completionNote !== "string" ||
        completionNote.trim().length > 3000
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completion note must be 3000 characters or fewer.",
      });
    }

    if (priority !== undefined) {
      ticket.priority = priority;
    }

    if (category !== undefined) {
      ticket.category = category;
    }

    if (aiSummary !== undefined) {
      ticket.aiSummary = aiSummary.trim();
    }

    if (completionNote !== undefined) {
      ticket.completionNote =
        completionNote.trim();
    }

    if (status !== undefined) {
      ticket.status = status;
    }

    ticket.aiTriageStatus = "reviewed";
    ticket.aiReviewedAt = new Date();

    await ticket.save();

    await ticket.populate(
      "customer",
      "name email"
    );

    await ticket.populate(
      "assignedWorker",
      "name email serviceCategories ratingAverage ratingCount"
    );

    emitTicketUpdate(getIO(), ticket);

    return res.json({
      success: true,
      message:
        "Request updated successfully.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Update worker ticket error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update request.",
    });
  }
};

export const sendWorkerMessage = async (
  req,
  res
) => {
  try {
    if (!workerOnly(req, res)) return;

    const ticket = await getOwned(
      req.params.id,
      req.user
    );

    const message =
      req.body.message?.trim();

    if (!ticket || !message) {
      return res.status(400).json({
        success: false,
        message:
          "A valid ticket and message are required.",
      });
    }

    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        message:
          "Message must be 3000 characters or fewer.",
      });
    }

    if (
      TERMINAL_TICKET_STATUSES.includes(
        ticket.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Closed requests cannot receive messages.",
      });
    }

    const newMessage = await Message.create({
      ticket: ticket._id,
      sender: req.user._id,
      senderRole: "worker",
      message,
    });

    await newMessage.populate(
      "sender",
      "name email"
    );

    emitMessageCreated(
      getIO(),
      newMessage,
      ticket
    );

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(
      "Send worker message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send message.",
    });
  }
};

export const getWorkerStats = async (
  req,
  res
) => {
  try {
    if (!workerOnly(req, res)) return;

    const byStatus = await Ticket.aggregate([
      {
        $match: {
          assignedWorker: req.user._id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const completed =
      byStatus.find(
        (row) => row._id === "Completed"
      )?.count || 0;

    const total = byStatus.reduce(
      (sum, row) => sum + row.count,
      0
    );

    return res.json({
      success: true,
      stats: {
        total,
        completed,
        completionRate: total
          ? Math.round(
              (completed / total) * 100
            )
          : 0,
        byStatus: Object.fromEntries(
          byStatus.map((row) => [
            row._id,
            row.count,
          ])
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get worker stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch statistics.",
    });
  }
};