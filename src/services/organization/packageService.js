import { apiService } from "@/services/apiService";

const PACKAGE_BASE_API = "/orgCatalogs/packages";

export const getPackageList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };
  // Add only non-empty fields
  if (filter.name) params.name = filter.name;
  if (filter.organizationId) params.organizationId = filter.organizationId;
  if (filter.createdBy) params.createdBy = filter.createdBy;
  if (filter.createdAt) params.createdAt = filter.createdAt;
  if (filter.updatedBy) params.updatedBy = filter.updatedBy;
  if (filter.updatedAt) params.updatedAt = filter.updatedAt;

  const response = await apiService.get(`${PACKAGE_BASE_API}`, {
    params, // 👈 filters go here
  });
  return response.data.data;
};

export const getPackageSummaryList = async (filter = {}) => {
  // Always keep page & size
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  // Add only non-empty fields
  if (filter.name) params.name = filter.name;
  if (filter.organizationId) params.organizationId = filter.organizationId;
  
  const response = await apiService.get(`${PACKAGE_BASE_API}/summaryList`, {
    params, // 👈 filters go here
  });
  return response.data.data;
};

export const createPackage = async (payload) => {
  const response = await apiService.post(`${PACKAGE_BASE_API}`, payload);
  return response.data.data;
};

export const getPackage = async (id) => {
  const response = await apiService.get(`${PACKAGE_BASE_API}/${id}`);
  return response.data.data;
};

export const editPackage = async (id, payload) => {
  const response = await apiService.put(`${PACKAGE_BASE_API}/${id}`, payload);
  return response.data.data;
};

export const deletePackage = async (id) => {
  const response = await apiService.delete(`${PACKAGE_BASE_API}/${id}`);
  return response.data.data;
};


//  Package Version 
export const getPackageVersion = async (versionId) => {
  const response = await apiService.get(`${PACKAGE_BASE_API}/versions/${versionId}`);
  return response.data.data;
};

export const getPackageVersionList = async (id) => {
  const response = await apiService.get(`${PACKAGE_BASE_API}/${id}/versions`);
  return response.data.data;
};

export const createPackageVersion = async (id, payload) => {
  const response = await apiService.post(`${PACKAGE_BASE_API}/${id}/versions`, payload);
  return response.data.data;
};

export const editPackageVersion = async (id, payload) => {
  const response = await apiService.put(`${PACKAGE_BASE_API}/${id}/versions`, payload);
  return response.data.data;
};

export const publishPackageVersion = async (packageId, versionId) => {
  const response = await apiService.post(`${PACKAGE_BASE_API}/${packageId}/versions/${versionId}/publish`);
  return response.data.data;
};


export const deletePackageVersion = async (id) => {
  const response = await apiService.delete(`${PACKAGE_BASE_API}/versions/${id}`);
  return response.data.data;
};