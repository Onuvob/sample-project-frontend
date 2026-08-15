import { apiService } from "@/services/apiService";

const USER_BASE_API = "/user";

export const getCurrentUser = async () => {
  const response = await apiService.get(`${USER_BASE_API}/me`);
  return response.data.data;
};

export const getOwnerList = async () => {
  const response = await apiService.get(`${USER_BASE_API}/ownerList`);
  return response.data.data;
};

export const updateUserProfile = async (userData) => {
  const response = await apiService.put(`${USER_BASE_API}/me`, userData);
  return response.data.data;
};