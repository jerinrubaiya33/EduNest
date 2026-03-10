// // frontend/src/api/axios.js
// import axios from "axios";

// const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const api = axios.create({
//   baseURL: base, // full server origin; we will call /api/auth/...
//   headers: {
//     "Content-Type": "application/json",
//   },
//   // timeout: 10000,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("eduNestToken");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (err) => Promise.reject(err)
// );

// api.interceptors.response.use(
//   (r) => r,
//   (err) => {
//     // expose error details to frontend (useful while debugging)
//     // don't change app behavior here — caller will still handle it
//     if (err.response) {
//       console.error("API response error:", {
//         status: err.response.status,
//         url: err.config?.url,
//         data: err.response.data,
//       });
//     } else {
//       console.error("API network/error:", err.message);
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;






// frontend/src/api/axios.js
import axios from "axios";

const base = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "";

const api = axios.create({
  baseURL: base || undefined,
  // ❌ DO NOT set Content-Type here
  // Axios will set it automatically per request
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

    // ✅ IMPORTANT FIX:
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
