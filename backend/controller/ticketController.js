import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

import generateTicketNumber from "../utils/generateTicketNumber.js";

import { requestTriage } from "../utils/aiTriage.js";

import {
  TERMINAL_TICKET_STATUSES,
  TICKET_CATEGORIES,
  isValidObjectId,
} from "../utils/ticketConstants.js";

import {
  findTicket,
  ownsTicket,
} from "../utils/ticketAccess.js";

import { getIO } from "../config/socket.js";

import {
  emitMessageCreated,
  emitTicketUpdate,
} from "../utils/socketEvents.js";

const customerOnly = (req, res) => {
  if (req.user.role === "customer") {
    return true;
  }

  res.status(403).json({
    success: false,
    message: "Customer access required.",
  });

  return false;
};

const notFound = (res) =>
  res.status(404).json({
    success: false,
    message: "Ticket not found.",
  });

export const getSuggestedWorkers = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const category =
      req.query.category?.trim();

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const escapedCategory =
      category.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const workers = await User.find({
      role: "worker",
      status: "active",
      serviceCategories: {
        $regex: `^${escapedCategory}$`,
        $options: "i",
      },
    })
      .select(
        "name email serviceCategories ratingAverage ratingCount"
      )
      .sort({
        ratingAverage: -1,
        ratingCount: -1,
        name: 1,
      })
      .limit(3);

    return res.json({
      success: true,
      workers,
    });
  } catch (error) {
    console.error(
      "Worker suggestions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch worker suggestions.",
    });
  }
};

export const createTicket = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const {
      workerId,
    } = req.body;

    const subject =
      req.body.subject?.trim();

    const description =
      req.body.description?.trim();

    const category =
      req.body.category?.trim();

    if (
      !subject ||
      !description ||
      !category ||
      !isValidObjectId(workerId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Subject, description, category, and a worker are required.",
      });
    }

    if (subject.length > 200) {
      return res.status(400).json({
        success: false,
        message:
          "Subject must be 200 characters or fewer.",
      });
    }

    if (description.length > 5000) {
      return res.status(400).json({
        success: false,
        message:
          "Description must be 5000 characters or fewer.",
      });
    }

    if (!TICKET_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category.",
      });
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
      status: "active",
    });

    if (!worker) {
      return res.status(400).json({
        success: false,
        message:
          "Selected worker is not available.",
      });
    }

    if (
      !worker.serviceCategories.some(
        (item) =>
          item.toLowerCase() ===
          category.toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected worker does not provide this service.",
      });
    }

    const ticket =
      await Ticket.create({
        ticketNumber:
          generateTicketNumber(),

        customer: req.user._id,

        assignedWorker: worker._id,

        subject,

        description,

        category,
      });

    try {
      const triage =
        await requestTriage({
          subject,
          description,
        });

      Object.assign(ticket, {
        aiCategory: triage.category,
        aiPriority: triage.priority,
        aiSummary: triage.summary,
        aiTriageStatus: "available",
        aiTriageError: "",
      });
    } catch (error) {
      console.error(
        "AI triage unavailable:",
        error.message
      );

      Object.assign(ticket, {
        aiTriageStatus: "unavailable",
        aiTriageError:
          "AI suggestion is unavailable. The worker can set details manually.",
      });
    }

    await ticket.save();

    await ticket.populate(
      "assignedWorker",
      "name email serviceCategories ratingAverage ratingCount"
    );

    emitTicketUpdate(
      getIO(),
      ticket
    );

    return res.status(201).json({
      success: true,
      message:
        "Service request created and sent to the selected worker.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Create ticket error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create service request.",
    });
  }
};

export const getCustomerTickets = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const tickets =
      await Ticket.find({
        customer: req.user._id,
      })
        .populate(
          "assignedWorker",
          "name email ratingAverage ratingCount serviceCategories"
        )
        .sort({
          createdAt: -1,
        });

    return res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(
      "Get customer tickets error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch your requests.",
    });
  }
};

export const getCustomerTicketById = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const ticket =
      await findTicket(
        req.params.id,
        true
      );

    if (
      !ticket ||
      !ownsTicket(
        ticket,
        req.user._id
      )
    ) {
      return notFound(res);
    }

    const [
      messages,
      review,
    ] = await Promise.all([
      Message.find({
        ticket: ticket._id,
      })
        .populate(
          "sender",
          "name email"
        )
        .sort({
          createdAt: 1,
        }),

      Review.findOne({
        ticket: ticket._id,
      }),
    ]);

    return res.json({
      success: true,
      ticket,
      messages,
      review,
    });
  } catch (error) {
    console.error(
      "Get customer ticket error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch request.",
    });
  }
};

export const updateCustomerTicket = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const ticket =
      await findTicket(
        req.params.id
      );

    if (
      !ticket ||
      !ownsTicket(
        ticket,
        req.user._id
      )
    ) {
      return notFound(res);
    }

    if (ticket.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending requests can be modified.",
      });
    }

    const {
      subject,
      description,
      category,
    } = req.body;

    if (subject !== undefined) {
      if (
        typeof subject !== "string" ||
        !subject.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Subject cannot be empty.",
        });
      }

      if (subject.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message:
            "Subject must be 200 characters or fewer.",
        });
      }

      ticket.subject =
        subject.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Description cannot be empty.",
        });
      }

      if (description.trim().length > 5000) {
        return res.status(400).json({
          success: false,
          message:
            "Description must be 5000 characters or fewer.",
        });
      }

      ticket.description =
        description.trim();
    }

    if (category !== undefined) {
      if (
        !TICKET_CATEGORIES.includes(
          category.trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category.",
        });
      }

      ticket.category =
        category.trim();
    }

    await ticket.save();

    emitTicketUpdate(
      getIO(),
      ticket
    );

    return res.json({
      success: true,
      message:
        "Request updated successfully.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Update customer ticket error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        "Invalid request update.",
    });
  }
};

export const cancelTicket = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const ticket =
      await findTicket(
        req.params.id
      );

    if (
      !ticket ||
      !ownsTicket(
        ticket,
        req.user._id
      )
    ) {
      return notFound(res);
    }

    if (
      TERMINAL_TICKET_STATUSES.includes(
        ticket.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This request is already closed.",
      });
    }

    const reason =
      req.body.reason?.trim();

    if (reason && reason.length > 3000) {
      return res.status(400).json({
        success: false,
        message:
          "Cancellation reason must be 3000 characters or fewer.",
      });
    }

    ticket.status = "Cancelled";

    ticket.cancelledReason =
      reason ||
      "Cancelled by customer";

    await ticket.save();

    emitTicketUpdate(
      getIO(),
      ticket
    );

    return res.json({
      success: true,
      message:
        "Request cancelled.",
      ticket,
    });
  } catch (error) {
    console.error(
      "Cancel ticket error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to cancel request.",
    });
  }
};

export const sendCustomerMessage = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const message =
      req.body.message?.trim();

    const ticket =
      await findTicket(
        req.params.id
      );

    if (
      !message ||
      !ticket ||
      !ownsTicket(
        ticket,
        req.user._id
      )
    ) {
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

    const newMessage =
      await Message.create({
        ticket: ticket._id,
        sender: req.user._id,
        senderRole: "customer",
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
      "Send customer message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send message.",
    });
  }
};

export const createReview = async (
  req,
  res
) => {
  try {
    if (!customerOnly(req, res)) return;

    const {
      rating,
      comment = "",
    } = req.body;

    const ticket =
      await findTicket(
        req.params.id
      );

    if (
      !ticket ||
      !ownsTicket(
        ticket,
        req.user._id
      )
    ) {
      return notFound(res);
    }

    if (ticket.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Reviews are available only for completed requests.",
      });
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be a whole number from 1 to 5.",
      });
    }

    if (
      typeof comment !== "string" ||
      comment.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Review comment must be 1000 characters or fewer.",
      });
    }

    if (!ticket.assignedWorker) {
      return res.status(400).json({
        success: false,
        message:
          "This request has no assigned worker.",
      });
    }

    const review =
      await Review.create({
        ticket: ticket._id,
        customer: req.user._id,
        worker: ticket.assignedWorker,
        rating,
        comment: comment.trim(),
      });

    const worker =
      await User.findById(
        ticket.assignedWorker
      );

    if (worker) {
      worker.ratingAverage =
        (
          worker.ratingAverage *
            worker.ratingCount +
          rating
        ) /
        (worker.ratingCount + 1);

      worker.ratingCount += 1;

      await worker.save();
    }

    return res.status(201).json({
      success: true,
      message:
        "Review submitted.",
      review,
    });
  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A review has already been submitted for this request.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit review.",
    });
  }
};