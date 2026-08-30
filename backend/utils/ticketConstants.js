export const TICKET_PRIORITIES = ["Low", "Medium", "High"];

export const TICKET_STATUSES = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Rejected",
  "Cancelled",
];

export const TERMINAL_TICKET_STATUSES = [
  "Completed",
  "Rejected",
  "Cancelled",
];

export const TICKET_CATEGORIES = [
  "Teaching",
  "Tutoring",
  "Technical",
  "Design",
];

export const isValidObjectId = (value) =>
  typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

/*
  Customer:
  Pending -> Cancelled

  Worker:
  Pending -> Accepted / Rejected
  Accepted -> In Progress
  In Progress -> Completed

  Terminal states cannot be changed.
*/

export const CUSTOMER_ALLOWED_TRANSITIONS = {
  Pending: ["Pending", "Cancelled"],
  Accepted: ["Accepted"],
  "In Progress": ["In Progress"],
  Completed: ["Completed"],
  Rejected: ["Rejected"],
  Cancelled: ["Cancelled"],
};

export const WORKER_ALLOWED_TRANSITIONS = {
  Pending: ["Pending", "Accepted", "Rejected"],
  Accepted: ["Accepted", "In Progress"],
  "In Progress": ["In Progress", "Completed"],
  Completed: ["Completed"],
  Rejected: ["Rejected"],
  Cancelled: ["Cancelled"],
};

export const isValidWorkerStatusTransition = (currentStatus, nextStatus) =>
  WORKER_ALLOWED_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;

export const isValidCustomerStatusTransition = (
  currentStatus,
  nextStatus
) =>
  CUSTOMER_ALLOWED_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;