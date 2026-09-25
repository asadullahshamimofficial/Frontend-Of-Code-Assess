import apiClient from "./client";

export const userApi = {
  getAll: async (params = {}) => {
    const res = await apiClient.get("/users", { params });
    return res.data;
  },
  updateRole: async (userId, role) => {
    const res = await apiClient.put(`/users/${userId}/role`, { role });
    return res.data;
  },
  toggleStatus: async (userId) => {
    const res = await apiClient.put(`/users/${userId}/toggle-status`);
    return res.data;
  },
  delete: async (userId) => {
    const res = await apiClient.delete(`/users/${userId}`);
    return res.data;
  },
};
