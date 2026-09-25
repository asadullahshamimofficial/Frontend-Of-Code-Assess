import apiClient from "./client";

export const submissionApi = {
  start: async (assessmentId) => {
    const res = await apiClient.post(`/submissions/start/${assessmentId}`);
    return res.data;
  },
  getMySubmissions: async () => {
    const res = await apiClient.get("/submissions/my");
    return res.data;
  },
  getAdminAll: async () => {
    const res = await apiClient.get("/submissions/admin/all");
    return res.data;
  },
  getDetail: async (submissionId) => {
    const res = await apiClient.get(`/submissions/${submissionId}`);
    return res.data;
  },
  saveAnswer: async (submissionId, questionId, answer) => {
    const res = await apiClient.post(`/submissions/${submissionId}/answers`, { question_id: questionId, answer });
    return res.data;
  },
  saveCoding: async (submissionId, questionId, code, language = "python") => {
    const res = await apiClient.post(`/submissions/${submissionId}/coding`, { question_id: questionId, code, language });
    return res.data;
  },
  submit: async (submissionId) => {
    const res = await apiClient.post(`/submissions/${submissionId}/submit`);
    return res.data;
  },
  getResult: async (submissionId) => {
    const res = await apiClient.get(`/submissions/${submissionId}/result`);
    return res.data;
  },
};
