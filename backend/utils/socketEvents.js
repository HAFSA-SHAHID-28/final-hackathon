const idOf = (value) =>
  value?._id?.toString?.() || value?.toString?.();

export const emitTicketUpdate = (io, ticket) => {
  if (!io || !ticket) return;

  const payload = ticket.toObject
    ? ticket.toObject()
    : ticket;

  const ticketId = idOf(payload._id);
  const customerId = idOf(payload.customer);
  const workerId = idOf(payload.assignedWorker);

  if (customerId) {
    io.to(`user:${customerId}`).emit(
      "ticket:updated",
      payload
    );
  }

  if (workerId) {
    io.to(`user:${workerId}`).emit(
      "ticket:updated",
      payload
    );
  }

  if (ticketId) {
    io.to(`ticket:${ticketId}`).emit(
      "ticket:updated",
      payload
    );
  }
};

export const emitMessageCreated = (
  io,
  message,
  ticket
) => {
  if (!io || !message || !ticket) return;

  const payload = message.toObject
    ? message.toObject()
    : message;

  const ticketId = idOf(ticket._id);
  const customerId = idOf(ticket.customer);
  const workerId = idOf(ticket.assignedWorker);

  if (ticketId) {
    io.to(`ticket:${ticketId}`).emit(
      "message:created",
      payload
    );
  }

  if (customerId) {
    io.to(`user:${customerId}`).emit(
      "message:created",
      payload
    );
  }

  if (workerId) {
    io.to(`user:${workerId}`).emit(
      "message:created",
      payload
    );
  }
};