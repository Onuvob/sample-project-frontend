import axios from "axios";
import { refreshAccessToken } from "@/services/authService";
import { routes } from "@/routes";
import { errorStore } from "@/store/globalErrorStore";


const API_BASE = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // needed for HttpOnly refreshToken
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const httpStatus = error.response?.status;


    // ✅ Prevent infinite loop: don't retry refreshToken request
    if (originalRequest.url.includes("/auth/public/refreshToken")) {
      // Refresh token itself failed → force logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = routes.login;
      return Promise.reject(error);
    }

    if (httpStatus === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken(); // call refresh token API
        if (!newToken) {
          throw new Error("Refresh token invalid");
        }
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        // If refresh fails → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = routes.login;
        return Promise.reject(err);
      }
    }
    let errorMessage = null; // default to null

    // Check backend response first
    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    // Only show if backend sent a message
    if (errorMessage && !originalRequest?.silent) {
      errorStore.show(errorMessage);
    }

    /* -------------------- GLOBAL ERROR HANDLING -------------------- */

    return Promise.reject(error);
  }
);

// Generic API wrapper functions
export const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;