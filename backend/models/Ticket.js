import mongoose from "mongoose";

import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../utils/ticketConstants.js";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      default: "Medium",
    },

    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: "Pending",
      index: true,
    },

    aiSummary: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    aiCategory: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    aiPriority: {
      type: String,
      enum: ["Low", "Medium", "High", ""],
      default: "",
    },

    aiTriageStatus: {
      type: String,
      enum: [
        "pending",
        "available",
        "unavailable",
        "reviewed",
      ],
      default: "pending",
    },

    aiTriageError: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    aiReviewedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    cancelledReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    completionNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.index({
  status: 1,
  priority: 1,
  createdAt: -1,
});

ticketSchema.index({
  assignedWorker: 1,
  status: 1,
  createdAt: -1,
});

ticketSchema.index({
  customer: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Ticket",
  ticketSchema
);