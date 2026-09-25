import apiClient from "./client";

export const assessmentApi = {
  getAll: async (params = {}) => (await apiClient.get("/assessments", { params })).data,
  getById: async (id) => (await apiClient.get(`/assessments/${id}`)).data,
  create: async (data) => (await apiClient.post("/assessments", data)).data,
  update: async (id, data) => (await apiClient.put(`/assessments/${id}`, data)).data,
  delete: async (id) => (await apiClient.delete(`/assessments/${id}`)).data,
};
