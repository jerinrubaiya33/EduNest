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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError =
      !error?.response &&
      (error?.message === "Network Error" || error?.code === "ERR_NETWORK");

    if (isNetworkError) {
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "";
      const configuredOrigin = apiOrigin || "(not set)";
      error.message = `Network Error contacting API. Check VITE_API_URL/VITE_BACKEND_URL (currently ${configuredOrigin}) and ensure backend CORS CLIENT_URLS includes ${currentOrigin}.`;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
