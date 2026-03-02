const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
};

export const lessonAPI = {
  createLesson: async (moduleId, payload) => {
    return fetchWithAuth(`${API_URL}/lessons/module/${moduleId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getLessons: async (moduleId) => {
    return fetchWithAuth(`${API_URL}/lessons/module/${moduleId}`, {
      method: "GET",
    });
  },
  updateLesson: async (lessonId, payload) => {
    return fetchWithAuth(`${API_URL}/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteLesson: async (lessonId) => {
    return fetchWithAuth(`${API_URL}/lessons/${lessonId}`, {
      method: "DELETE",
    });
  },
};
