import { apiService } from "@/services/apiService";

const ROUTE_BASE_API = "/adminRoutes";

export const getRouteList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.destination) params.destination = filter.destination;

  const response = await apiService.get(`${ROUTE_BASE_API}/list`, {
    params, // filters
  });
  return response.data.data;
};

export const createRoute = async (payload) => {
  const response = await apiService.post(`${ROUTE_BASE_API}/create`, payload);
  return response.data.data;
};

export const getRoute = async (id) => {
    const response = await apiService.get(`${ROUTE_BASE_API}/get/${id}`);
    return response.data.data;
};

export const editRoute = async (id, payload) => {
  const response = await apiService.put(`${ROUTE_BASE_API}/update/${id}`, payload);
  return response.data.data;
};

export const deleteRoute = async (id) => {
  const response = await apiService.delete(`${ROUTE_BASE_API}/delete/${id}`);
  return response.data;
};