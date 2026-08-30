import Api from "./api";

// ================= CUSTOMER =================

export const getSuggestedWorkers = async (category) => {
  const response = await Api.get(
    `/tickets/suggested-workers?category=${encodeURIComponent(
      category.trim()
    )}`
  );

  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await Api.post("/tickets", ticketData);
  return response.data;
};

export const getCustomerTickets = async () => {
  const response = await Api.get("/tickets/my-tickets");
  return response.data;
};

export const getCustomerTicket = async (id) => {
  const response = await Api.get(`/tickets/${id}`);
  return response.data;
};

export const updateCustomerTicket = async (id, data) => {
  const response = await Api.patch(`/tickets/${id}`, data);
  return response.data;
};

export const cancelTicket = async (id, reason = "") => {
  const response = await Api.patch(`/tickets/${id}/cancel`, {
    reason,
  });

  return response.data;
};

export const sendCustomerMessage = async (id, message) => {
  const response = await Api.post(`/tickets/${id}/messages`, {
    message,
  });

  return response.data;
};

export const createReview = async (id, data) => {
  const response = await Api.post(`/tickets/${id}/review`, data);
  return response.data;
};

// ================= WORKER =================

export const getWorkerTickets = async () => {
  const response = await Api.get("/worker/tickets");
  return response.data;
};

export const getWorkerTicket = async (id) => {
  const response = await Api.get(`/worker/tickets/${id}`);
  return response.data;
};

export const respondToTicket = async (id, data) => {
  const response = await Api.patch(
    `/worker/tickets/${id}/respond`,
    data
  );

  return response.data;
};

export const updateWorkerTicket = async (id, data) => {
  const response = await Api.patch(
    `/worker/tickets/${id}`,
    data
  );

  return response.data;
};

export const sendWorkerMessage = async (id, message) => {
  const response = await Api.post(
    `/worker/tickets/${id}/messages`,
    {
      message,
    }
  );

  return response.data;
};

export const getWorkerStats = async () => {
  const response = await Api.get("/worker/dashboard/stats");
  return response.data;
};

// ================= ADMIN =================

export const getAdminUsers = async (role) => {
  const query = role
    ? `?role=${encodeURIComponent(role)}`
    : "";

  const response = await Api.get(`/admin/users${query}`);

  return response.data;
};

export const getAdminWorker = async (id) => {
  const response = await Api.get(`/admin/workers/${id}`);

  return response.data;
};