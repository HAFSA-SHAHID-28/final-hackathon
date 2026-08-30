import Api from "./api";

// =========================================================
// ADMIN DASHBOARD
// =========================================================

export const getAdminDashboardStats = async () => {
  const response = await Api.get("/admin/dashboard/stats");
  return response.data;
};

// =========================================================
// USERS
// =========================================================

export const getAdminUsers = async (role = "") => {
  const url = role
    ? `/admin/users?role=${role}`
    : "/admin/users";

  const response = await Api.get(url);

  return response.data;
};

// =========================================================
// COMPLAINTS / TICKETS
// =========================================================

export const getAdminTickets = async () => {
  const response = await Api.get("/admin/tickets");

  return response.data;
};

export const getAdminTicket = async (id) => {
  const response = await Api.get(`/admin/tickets/${id}`);

  return response.data;
};

// =========================================================
// WORKER OVERVIEW
// =========================================================

export const getAdminWorker = async (id) => {
  const response = await Api.get(`/admin/workers/${id}`);

  return response.data;
};