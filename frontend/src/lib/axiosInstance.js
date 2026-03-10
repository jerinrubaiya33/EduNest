// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// export default axiosInstance;






// import axios from "axios";
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api", 
//   withCredentials: true,
// });
// export default axiosInstance;




import axios from "axios";

const apiOrigin = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "";

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
