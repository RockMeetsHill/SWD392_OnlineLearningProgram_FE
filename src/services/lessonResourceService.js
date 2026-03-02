const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(url, { ...options, headers, credentials: "include" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

export const lessonResourceAPI = {
  listByLesson: (lessonId) =>
    fetchWithAuth(`${API_URL}/lessons/${lessonId}/resources`, { method: "GET" }),

  create: (lessonId, formData) =>
    fetchWithAuth(`${API_URL}/lessons/${lessonId}/resources`, {
      method: "POST",
      body: formData,
    }),

  delete: (resourceId) =>
    fetchWithAuth(`${API_URL}/resources/${resourceId}`, { method: "DELETE" }),
};
