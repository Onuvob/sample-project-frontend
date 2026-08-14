import { apiService } from "@/services/apiService";
import { routes } from "@/routes";

const AUTH_BASE_API = "/auth";

/* -------------------- LOGIN -------------------- */
export const login = async (email, password) => {

  console.log("Logging in with email:", email); // Debugging line
  console.log("Logging in with password:", password); // Debugging line
  const response = await apiService.post(`${AUTH_BASE_API}/login`, {
    email,
    password,
  });

  const { accessToken, refreshToken } = response.data.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data.data;
};


/* -------------------- REGISTER -------------------- */
export const register = async (registerData) => {
  const response = await apiService.post(
    `${AUTH_BASE_API}/register`,
    registerData
  );

  return response.data.data;
};

/* -------------------- REFRESH TOKEN -------------------- */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await apiService.post(`${AUTH_BASE_API}/refreshToken`, {
    refreshToken,
  });

  const newAccessToken = response.data.data.accessToken;
  const newRefreshToken = response.data.data.refreshToken;

  if (newAccessToken) {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newAccessToken;
  }

  throw new Error("Unable to refresh token");
};

/* -------------------- LOGOUT -------------------- */
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = routes.login;
};
