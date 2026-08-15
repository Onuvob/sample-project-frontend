import { apiService } from "@/services/apiService";

const BOOKING_BASE_API = "/adminBookings";

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


export const getBooking = async (id) => {
    const response = await apiService.get(`${BOOKING_BASE_API}/get/${id}`);
    return response.data.data;
};

export const approveBooking = async (id) => {
    const response = await apiService.put(`${BOOKING_BASE_API}/approve/${id}`);
    return response.data.data;
};

export const rejectBooking = async (id) => {
  const response = await apiService.put(`${BOOKING_BASE_API}/reject/${id}`);
  return response.data.data;
};

export const assignPilot = async (id, payload) => {
  const response = await apiService.put(`${BOOKING_BASE_API}/assignPilot/${id}`, payload);
  return response.data.data;
};