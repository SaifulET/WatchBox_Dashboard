import axios from "axios";
import { API_BASE_URL, api } from "../lib/api";

const unwrap = (response) => response.data?.data;

const contactClient = axios.create({
  baseURL: import.meta.env.DEV ? "" : API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const postContact = (client, path, payload) => client.post(path, payload).then(unwrap);

export const publicPagesApi = {
  getContent: (slug) => api.get(`/api/v1/content/${slug}`).then(unwrap),

  submitContact: async (payload) => {
    try {
      return await postContact(contactClient, "/api/v1/public/contact", payload);
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }
      return postContact(api, "/api/v1/support/tickets", payload);
    }
  },
};
