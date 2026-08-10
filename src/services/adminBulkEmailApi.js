import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminBulkEmailApi = {
  listRecipients: (params) =>
    api.get("/api/v1/admin/bulk-email/recipients", { params }).then(unwrap),

  listTemplates: () =>
    api.get("/api/v1/admin/bulk-email/templates").then(unwrap),

  createCampaign: (payload) =>
    api.post("/api/v1/admin/bulk-email/campaigns", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(unwrap),

  sendCampaign: (campaignId) =>
    api.post(`/api/v1/admin/bulk-email/campaigns/${campaignId}/send`).then(unwrap),
};
