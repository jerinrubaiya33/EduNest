import axios from "axios";

const rawApiOrigin =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";

const apiOrigin = rawApiOrigin ? rawApiOrigin.replace(/\/$/, "") : "";

if (import.meta.env.PROD && !apiOrigin) {
  console.warn(
    "[EduNest] Missing VITE_API_URL (or VITE_BACKEND_URL). API calls may fail in production."
  );
}

const axiosInstance = axios.create({
  baseURL: apiOrigin ? `${apiOrigin}/api` : "/api",
  withCredentials: true,
});

//  Attach EduNest JWT
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduNestToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
