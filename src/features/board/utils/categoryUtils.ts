// Utility to convert API ticket to TicketData
export function convertToTicketData(ticket) {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description || "No description",
    expiresAt: ticket.expiresAt,
    categoryId: ticket.categoryId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    labels: ticket.labels,
    category: ticket.category,
    history: ticket.history,
  };
}

// Utility to extract error message from API error
export function extractApiErrorMessage(error) {
  if (!error || typeof error !== "object") return null;
  if (Array.isArray(error?.data) && error.data[0]?.message) {
    return error.data[0].message;
  }
  if (error?.data?.error?.message) {
    return error.data.error.message;
  }
  if (error?.data?.message) {
    return error.data.message;
  }
  if (error?.status) {
    return `HTTP ${error.status}: Unknown error`;
  }
  return null;
}

// Utility to find a ticket by ID and convert to TicketData
export function findTicketById(tickets, id) {
  const found = tickets?.find((t) => t.id.toString() === id.toString());
  return found ? convertToTicketData(found) : undefined;
}
