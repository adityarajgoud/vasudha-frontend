import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Automatic JWT header injection
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("vasudha_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("vasudha_token");
      localStorage.removeItem("vasudha_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
