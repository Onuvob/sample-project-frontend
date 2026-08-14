import { apiService } from "@/services/apiService";

const OWNER_VEHICLE_BASE_API = "/adminVehicles";

export const getPendingVehicleList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;

  const response = await apiService.get(`${OWNER_VEHICLE_BASE_API}/pending`, {
    params, // filters
  });
  return response.data.data;
};

export const approveOwnerVehicle = async (id) => {
  const response = await apiService.put(`${OWNER_VEHICLE_BASE_API}/approve/${id}`);
  return response.data.data;
};

export const rejectOwnerVehicle = async (id) => {
  const response = await apiService.put(`${OWNER_VEHICLE_BASE_API}/reject/${id}`);
  return response.data.data;
};