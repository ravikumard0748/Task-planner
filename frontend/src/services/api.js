import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const decomposeGoal = async (payload) => {
  const { data } = await api.post("/api/decompose-goal", payload);
  return data;
};

export const scheduleTasks = async (payload) => {
  const { data } = await api.post("/api/schedule-tasks", payload);
  return data;
};

export const executeTask = async (payload) => {
  const { data } = await api.post("/api/execute-task", payload);
  return data;
};

export const replanProject = async (payload) => {
  const { data } = await api.post("/api/replan", payload);
  return data;
};

export const assignRoles = async (payload) => {
  const { data } = await api.post("/api/assign-roles", payload);
  return data;
};

export const analyzeRisk = async (payload) => {
  const { data } = await api.post("/api/analyze-risk", payload);
  return data;
};

export default api;
