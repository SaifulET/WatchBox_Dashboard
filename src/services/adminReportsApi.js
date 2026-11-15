import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminReportsApi = {
  listReports: (params) =>
    api.get("/api/v1/admin/reports", { params }).then(unwrap),

  getSummary: () => api.get("/api/v1/admin/reports/summary").then(unwrap),

  getReport: (reportId) =>
    api.get(`/api/v1/admin/reports/${reportId}`).then(unwrap),

  setStatus: (reportId, status) =>
    api.post(`/api/v1/admin/reports/${reportId}/status`, { status }).then(unwrap),

  resolve: (reportId) =>
    api.post(`/api/v1/admin/reports/${reportId}/resolve`).then(unwrap),

  dismiss: (reportId) =>
    api.post(`/api/v1/admin/reports/${reportId}/dismiss`).then(unwrap),

  deleteReport: (reportId) =>
    api.delete(`/api/v1/admin/reports/${reportId}`).then(unwrap),
};
