import { api } from "../lib/api";

const unwrap = (response) => response.data?.data;

export const adminAdministratorsApi = {
  listRoles: () =>
    api.get("/api/v1/admin/administrators/roles").then(unwrap),

  listPermissions: () =>
    api.get("/api/v1/admin/administrators/permissions").then(unwrap),

  createAdministrator: (payload) =>
    api.post("/api/v1/admin/administrators", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(unwrap),
};
