import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminAuthApi = {
  register: (payload) =>
    api.post("/api/v1/admin/auth/register", payload).then(unwrap),

  login: (payload) =>
    api.post("/api/v1/admin/auth/login", payload).then(unwrap),

  refresh: (refreshToken) =>
    api.post("/api/v1/admin/auth/refresh", { refreshToken }).then(unwrap),

  logout: () =>
    api.post("/api/v1/admin/auth/logout").then(unwrap),

  logoutAll: () =>
    api.post("/api/v1/admin/auth/logout-all").then(unwrap),

  forgotPassword: (email) =>
    api.post("/api/v1/admin/auth/forgot-password", { email }).then(unwrap),

  verifyResetCode: (token) =>
    api.post("/api/v1/admin/auth/verify-reset-code", { token }).then(unwrap),

  resetPassword: (payload) =>
    api.post("/api/v1/admin/auth/reset-password", payload).then(unwrap),

  changePassword: (payload) =>
    api.post("/api/v1/admin/auth/change-password", payload).then(unwrap),

  listSessions: () =>
    api.get("/api/v1/admin/auth/sessions").then(unwrap),

  revokeSession: (sessionId) =>
    api.delete(`/api/v1/admin/auth/sessions/${sessionId}`).then(unwrap),

  setupMfa: () =>
    api.post("/api/v1/admin/auth/mfa/setup").then(unwrap),

  verifyMfa: (code) =>
    api.post("/api/v1/admin/auth/mfa/verify", { code }).then(unwrap),

  challengeMfa: (email) =>
    api.post("/api/v1/admin/auth/mfa/challenge", { email }).then(unwrap),

  disableMfa: () =>
    api.delete("/api/v1/admin/auth/mfa").then(unwrap),

  getPermissions: () =>
    api.get("/api/v1/admin/auth/me/permissions").then(unwrap),
};
