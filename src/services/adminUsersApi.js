import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminUsersApi = {
  listUsers: (params) =>
    api.get("/api/v1/admin/users", { params }).then(unwrap),

  getUser: (userId) =>
    api.get(`/api/v1/admin/users/${userId}`).then(unwrap),

  getSummary: () =>
    api.get("/api/v1/admin/users/summary").then(unwrap),

  suspendUser: (userId) =>
    api.post(`/api/v1/admin/users/${userId}/suspend`).then(unwrap),

  unsuspendUser: (userId) =>
    api.post(`/api/v1/admin/users/${userId}/unsuspend`).then(unwrap),
};
