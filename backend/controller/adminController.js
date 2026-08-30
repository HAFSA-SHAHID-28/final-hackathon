import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import Review from "../models/Review.js";

import { isValidObjectId } from "../utils/ticketConstants.js";

const adminOnly = (req, res) => {
  if (req.user.role === "admin") {
    return true;
  }

  res.status(403).json({
    success: false,
    message: "Admin access required.",
  });

  return false;
};

// =========================================================
// GET ALL USERS
// =========================================================

export const getUsers = async (req, res) => {
  try {
    if (!adminOnly(req, res)) return;

    const role =
      ["customer", "worker"].includes(req.query.role)
        ? { role: req.query.role }
        : {};

    const users = await User.find(role)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

// =========================================================
// ADMIN DASHBOARD STATS
// =========================================================

export const getDashboardStats = async (req, res) => {
  try {
    if (!adminOnly(req, res)) return;

    const [
      totalUsers,
      totalCustomers,
      totalWorkers,
      totalTickets,
      ticketStatus,
    ] = await Promise.all([
      User.countDocuments({
        role: { $in: ["customer", "worker"] },
      }),

      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "worker",
      }),

      Ticket.countDocuments(),

      Ticket.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const byStatus = Object.fromEntries(
      ticketStatus.map((item) => [item._id, item.count])
    );

    return res.json({
      success: true,

      stats: {
        totalUsers,
        totalCustomers,
        totalWorkers,

        totalTickets,

        pending: byStatus.Pending || 0,
        accepted: byStatus.Accepted || 0,
        inProgress: byStatus["In Progress"] || 0,
        completed: byStatus.Completed || 0,
        rejected: byStatus.Rejected || 0,
        cancelled: byStatus.Cancelled || 0,

        byStatus,
      },
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin dashboard statistics.",
    });
  }
};

// =========================================================
// GET ALL TICKETS / COMPLAINTS
// =========================================================

export const getAllTickets = async (req, res) => {
  try {
    if (!adminOnly(req, res)) return;

    const tickets = await Ticket.find({})
      .populate("customer", "name email")
      .populate(
        "assignedWorker",
        "name email serviceCategories ratingAverage ratingCount"
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Admin get tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch complaints.",
    });
  }
};

// =========================================================
// GET SINGLE TICKET
// =========================================================

export const getTicketById = async (req, res) => {
  try {
    if (!adminOnly(req, res)) return;

    if (!isValidObjectId(req.params.ticketId)) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("customer", "name email")
      .populate(
        "assignedWorker",
        "name email serviceCategories ratingAverage ratingCount"
      );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Admin get ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch ticket.",
    });
  }
};

// =========================================================
// WORKER OVERVIEW
// =========================================================

export const getWorkerOverview = async (req, res) => {
  try {
    if (!adminOnly(req, res)) return;

    if (!isValidObjectId(req.params.workerId)) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    const worker = await User.findOne({
      _id: req.params.workerId,
      role: "worker",
    }).select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    const [tickets, reviews] = await Promise.all([
      Ticket.find({
        assignedWorker: worker._id,
      })
        .populate("customer", "name email")
        .sort({ createdAt: -1 }),

      Review.find({
        worker: worker._id,
      })
        .populate("customer", "name")
        .sort({ createdAt: -1 }),
    ]);

    return res.json({
      success: true,
      worker,
      tickets,
      reviews,
    });
  } catch (error) {
    console.error("Get worker overview error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch worker overview.",
    });
  }
};