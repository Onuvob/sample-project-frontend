import { apiService } from "@/services/apiService";

const ORGANIZATION_BASE_API = "/organizations";

export const getOrganizationList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;
  if (filter.rootUser) params.rootUser = filter.rootUser;
  if (filter.createdBy) params.createdBy = filter.createdBy;
  if (filter.updatedBy) params.updatedBy = filter.updatedBy;
  if (filter.createdAt) params.createdAt = filter.createdAt;
  if (filter.updatedAt) params.updatedAt = filter.updatedAt;

  const response = await apiService.get(`${ORGANIZATION_BASE_API}/list`, {
    params, // 👈 filters go here
  });
  return response.data.data;
};

export const getOrganizationSummaryList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;

  const response = await apiService.get(`${ORGANIZATION_BASE_API}/summaryList`, {
    params, // 👈 filters go here
  });
  return response.data.data;
};

export const createOrganization = async (payload) => {
  const response = await apiService.post(`${ORGANIZATION_BASE_API}/`, payload);
  return response.data.data;
};

export const getOrganization = async (id) => {
    const response = await apiService.get(`${ORGANIZATION_BASE_API}/${id}`);
    return response.data.data;
};

export const editOrganization = async (id, payload) => {
  const response = await apiService.put(`${ORGANIZATION_BASE_API}/${id}`, payload);
  return response.data.data;
};

export const deleteOrganization = async (id) => {
  const response = await apiService.delete(`${ORGANIZATION_BASE_API}/${id}`);
  return response.data;
};