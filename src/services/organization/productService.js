import { apiService } from "@/services/apiService";

const PRODUCT_BASE_API = "/orgCatalogs/products";

export const getProductList = async (filter = {}) => {
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  if (filter.name) params.name = filter.name;
  if (filter.organizationId) params.organizationId = filter.organizationId;
  if (filter.productId) params.productId = filter.productId;
  if (filter.sku) params.sku = filter.sku;

  // IMPORTANT: boolean must be checked properly
  if (filter.isActive !== null && filter.isActive !== undefined)
    params.isActive = filter.isActive;

  if (filter.createdBy) params.createdBy = filter.createdBy;
  if (filter.createdAt) params.createdAt = filter.createdAt;
  if (filter.updatedBy) params.updatedBy = filter.updatedBy;
  if (filter.updatedAt) params.updatedAt = filter.updatedAt;

  const response = await apiService.get(PRODUCT_BASE_API, {
    params,
  });

  return response.data.data;
};


export const createProduct = async (payload) => {
  const response = await apiService.post(`${PRODUCT_BASE_API}`, payload);
  return response.data.data;
};

export const getProduct = async (id) => {
  const response = await apiService.get(`${PRODUCT_BASE_API}/${id}`);
  return response.data.data;
};

export const editProduct = async (id, payload) => {
  const response = await apiService.put(`${PRODUCT_BASE_API}/${id}`, payload);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await apiService.delete(`${PRODUCT_BASE_API}/${id}`);
  return response.data.data;
};