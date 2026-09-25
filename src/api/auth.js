import apiClient from "./client";

export const authApi = {
  signup: async (name, email, password) => (await apiClient.post("/auth/signup", { name, email, password })).data,

  login: async (email, password) => {
    const data = new URLSearchParams({ username: email, password });
    return (await apiClient.post("/auth/login", data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })).data;
  },

  getMe: async () => (await apiClient.get("/auth/me")).data,
  refreshToken: async (token) => (await apiClient.post("/auth/refresh", { refresh_token: token })).data,
  forgotPassword: async (email) => (await apiClient.post("/auth/forgot-password", { email })).data,
  resetPassword: async (email, new_password) => (await apiClient.post("/auth/reset-password", { email, new_password })).data,
};
