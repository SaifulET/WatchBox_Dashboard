import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminEarningsApi = {
  summary: () => api.get("/api/v1/admin/earnings/summary").then(unwrap),

  transactions: (params) =>
    api.get("/api/v1/admin/earnings/transactions", { params }).then(unwrap),

  transaction: (transactionId) =>
    api.get(`/api/v1/admin/earnings/transactions/${encodeURIComponent(transactionId)}`).then(unwrap),

  exportTransactions: (params) =>
    api.get("/api/v1/admin/earnings/transactions/export", {
      params,
      responseType: "blob",
    }),
};
