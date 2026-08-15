import { apiService } from "@/services/apiService";

const BOOKING_BASE_API = "/bookings";

export const getBookingList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;

  const response = await apiService.get(`${BOOKING_BASE_API}/list`, {
    params, // filters
  });
  return response.data.data;
};

export const createBooking = async (payload) => {
  const response = await apiService.post(`${BOOKING_BASE_API}/create`, payload);
  return response.data.data;
};

export const getBooking = async (id) => {
    const response = await apiService.get(`${BOOKING_BASE_API}/get/${id}`);
    return response.data.data;
};

export const editBooking = async (id, payload) => {
  const response = await apiService.put(`${BOOKING_BASE_API}/update/${id}`, payload);
  return response.data.data;
};

export const deleteBooking = async (id) => {
  const response = await apiService.delete(`${BOOKING_BASE_API}/delete/${id}`);
  return response.data;
};