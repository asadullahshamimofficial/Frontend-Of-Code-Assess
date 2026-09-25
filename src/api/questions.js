import apiClient from "./client";

export const questionApi = {
  getCandidateQuestions: async (params = {}) => {
    const res = await apiClient.get("/questions", { params });
    return res.data;
  },
  getAdminQuestions: async (params = {}) => {
    const res = await apiClient.get("/questions/admin", { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/questions/${id}`);
    return res.data;
  },
  create: async (assessmentId, data) => {
    const res = await apiClient.post(`/questions/assessment/${assessmentId}`, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/questions/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/questions/${id}`);
    return res.data;
  },
};
