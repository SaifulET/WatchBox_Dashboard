import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminNotificationsApi = {
  list: (params) =>
    api.get("/api/v1/admin/notifications", { params }).then(unwrap),

  unreadCount: () =>
    api.get("/api/v1/admin/notifications/unread-count").then(unwrap),

  markRead: (notificationId) =>
    api.post(`/api/v1/admin/notifications/${notificationId}/read`).then(unwrap),

  markAllRead: () =>
    api.post("/api/v1/admin/notifications/read-all").then(unwrap),
};
