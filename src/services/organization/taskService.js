import { apiService } from "@/services/apiService";

const TASK_BASE_API = "/orgCatalogs/tasks";

export const getTaskList = async (filter = {}) => {
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
  };

  if (filter.name) params.name = filter.name;
  if (filter.organizationId) params.organizationId = filter.organizationId;
  if (filter.taskId) params.taskId = filter.taskId;

  if (filter.createdBy) params.createdBy = filter.createdBy;
  if (filter.createdAt) params.createdAt = filter.createdAt;
  if (filter.updatedBy) params.updatedBy = filter.updatedBy;
  if (filter.updatedAt) params.updatedAt = filter.updatedAt;

  const response = await apiService.get(TASK_BASE_API, {
    params,
  });

  return response.data.data;
};


export const createTask = async (payload) => {
  const response = await apiService.post(`${TASK_BASE_API}`, payload);
  return response.data.data;
};

export const getTask = async (id) => {
  const response = await apiService.get(`${TASK_BASE_API}/${id}`);
  return response.data.data;
};

export const editTask = async (id, payload) => {
  const response = await apiService.put(`${TASK_BASE_API}/${id}`, payload);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await apiService.delete(`${TASK_BASE_API}/${id}`);
  return response.data.data;
};