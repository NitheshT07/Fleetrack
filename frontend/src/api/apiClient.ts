import axios from "axios";

// ✅ Correct base URL for Vite
const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,  // <-- FIXED
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");

    if (!isAuthEndpoint) {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("fleettrack_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("fleettrack_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
