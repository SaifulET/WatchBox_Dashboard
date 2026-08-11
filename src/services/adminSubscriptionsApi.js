import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminSubscriptionsApi = {
  listPlans: () => api.get("/api/v1/admin/subscriptions/plans").then(unwrap),
  createPlan: (payload) => api.post("/api/v1/admin/subscriptions/plans", payload).then(unwrap),
  updatePlan: (planId, payload) =>
    api.patch(`/api/v1/admin/subscriptions/plans/${encodeURIComponent(planId)}`, payload).then(unwrap),
  updatePlanFeatures: (planId, payload) =>
    api.patch(`/api/v1/admin/subscriptions/plans/${encodeURIComponent(planId)}/features`, payload).then(unwrap),

  settings: () => api.get("/api/v1/admin/subscriptions/settings").then(unwrap),
  updateSettings: (payload) => api.patch("/api/v1/admin/subscriptions/settings", payload).then(unwrap),

  listPromotions: () => api.get("/api/v1/admin/subscriptions/promotions").then(unwrap),
  createPromotion: (payload) => api.post("/api/v1/admin/subscriptions/promotions", payload).then(unwrap),
  deletePromotion: (promotionId) =>
    api.delete(`/api/v1/admin/subscriptions/promotions/${encodeURIComponent(promotionId)}`).then(unwrap),

  recentActions: () => api.get("/api/v1/admin/subscriptions/actions").then(unwrap),
};
