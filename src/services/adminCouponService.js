import { apiService } from "@/services/apiService";

const COUPON_BASE_API = "/adminCoupons";

export const getCouponList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.code) params.code = filter.code;

  const response = await apiService.get(`${COUPON_BASE_API}/list`, {
    params, // filters
  });
  return response.data.data;
};

export const createCoupon = async (payload) => {
  const response = await apiService.post(`${COUPON_BASE_API}/create`, payload);
  return response.data.data;
};

export const getCoupon = async (id) => {
    const response = await apiService.get(`${COUPON_BASE_API}/get/${id}`);
    return response.data.data;
};

export const editCoupon = async (id, payload) => {
  const response = await apiService.put(`${COUPON_BASE_API}/update/${id}`, payload);
  return response.data.data;
};

export const deleteCoupon = async (id) => {
  const response = await apiService.delete(`${COUPON_BASE_API}/delete/${id}`);
  return response.data;
};