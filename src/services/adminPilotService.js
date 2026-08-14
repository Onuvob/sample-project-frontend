import { apiService } from "@/services/apiService";

const PILOT_BASE_API = "/adminPilots";

export const getPilotList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;

  const response = await apiService.get(`${PILOT_BASE_API}/list`, {
    params, // filters
  });
  return response.data.data;
};

export const createPilot = async (payload) => {
  const response = await apiService.post(`${PILOT_BASE_API}/create`, payload);
  return response.data.data;
};

export const getPilot = async (id) => {
    const response = await apiService.get(`${PILOT_BASE_API}/get/${id}`);
    return response.data.data;
};

export const editPilot = async (id, payload) => {
  const response = await apiService.put(`${PILOT_BASE_API}/update/${id}`, payload);
  return response.data.data;
};

export const deletePilot = async (id) => {
  const response = await apiService.delete(`${PILOT_BASE_API}/delete/${id}`);
  return response.data;
};