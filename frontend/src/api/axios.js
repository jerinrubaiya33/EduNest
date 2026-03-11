// frontend/src/api/axios.js
import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";
const normalizedBase = rawBase ? rawBase.replace(/\/$/, "") : "";
const isProd = Boolean(import.meta.env.PROD);
const isLocalhostBase =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedBase);
const base = isProd && isLocalhostBase ? "" : normalizedBase;

const api = axios.create({
  baseURL: base || undefined,
});

/**
 * REQUEST INTERCEPTOR
 * - Attach auth token
 * - Handle JSON vs FormData correctly
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eduNestToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT FIX:
    // If sending FormData, REMOVE Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR (debug-friendly)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API response error:", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
    } else {
      console.error("API network/error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
