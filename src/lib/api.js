import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_STORAGE_KEY = "modevin-auth";

const getStoredAccessToken = () => {
  try {
    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(storedAuth);
    return parsedAuth?.state?.tokens?.accessToken || null;
  } catch {
    return null;
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export const getApiErrorMessage = (error) => {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};
