import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminContentApi = {
  getPage: (slug) =>
    api.get(`/api/v1/admin/settings/content/pages/${slug}`).then(unwrap),

  createPage: (slug, payload) =>
    api.post(`/api/v1/admin/settings/content/pages/${slug}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(unwrap),

  updatePage: (slug, payload) =>
    api.patch(`/api/v1/admin/settings/content/pages/${slug}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(unwrap),
};
