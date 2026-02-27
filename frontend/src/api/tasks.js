import { api } from "./client";

export async function fetchTasks(token) {
  const res = await api.get("/api/tasks", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return res.data;
}

export async function createTask(token, { title, description }) {
  const res = await api.post(
    "/api/tasks",
    { title, description },
    { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
  );
  return res.data;
}

export async function updateTask(token, id, updates) {
  const res = await api.put(`/api/tasks/${id}`, updates, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return res.data;
}

export async function deleteTask(token, id) {
  const res = await api.delete(`/api/tasks/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return res.data;
}

