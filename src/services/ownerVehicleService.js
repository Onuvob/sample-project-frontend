import { apiService } from "@/services/apiService";

const OWNER_VEHICLE_BASE_API = "/vehicles";

export const getOwnerVehicleList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;

  const response = await apiService.get(`${OWNER_VEHICLE_BASE_API}/list`, {
    params, // filters
  });
  return response.data.data;
};

export const createOwnerVehicle = async (payload) => {
  const response = await apiService.post(`${OWNER_VEHICLE_BASE_API}/create`, payload);
  return response.data.data;
};

export const getOwnerVehicle = async (id) => {
    const response = await apiService.get(`${OWNER_VEHICLE_BASE_API}/get/${id}`);
    return response.data.data;
};

export const editOwnerVehicle = async (id, payload) => {
  const response = await apiService.put(`${OWNER_VEHICLE_BASE_API}/update/${id}`, payload);
  return response.data.data;
};

export const deleteOwnerVehicle = async (id) => {
  const response = await apiService.delete(`${OWNER_VEHICLE_BASE_API}/delete/${id}`);
  return response.data;
};