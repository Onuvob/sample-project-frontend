import { apiService } from "@/services/apiService";

const COUPON_BASE_API = "/coupons";

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