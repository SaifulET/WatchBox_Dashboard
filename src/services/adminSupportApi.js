import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminSupportApi = {
  listTickets: (params) =>
    api.get("/api/v1/admin/support/tickets", { params }).then(unwrap),

  getTicket: (ticketId) =>
    api.get(`/api/v1/admin/support/tickets/${ticketId}`).then(unwrap),

  reply: (ticketId, { message, files }) => {
    const form = new FormData();
    if (message?.trim()) {
      form.append("message", message.trim());
    }
    files.forEach((file) => form.append("attachments", file));

    return api
      .post(`/api/v1/admin/support/tickets/${ticketId}/messages`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(unwrap);
  },
};
