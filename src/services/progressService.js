const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers, credentials: "include" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

export const progressAPI = {
  getCourseProgress: (courseId) =>
    fetchWithAuth(`${API_URL}/progress/courses/${courseId}`, { method: "GET" }),

  updateLessonProgress: (lessonId, payload) =>
    fetchWithAuth(`${API_URL}/progress/lessons/${lessonId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  startLesson: (lessonId) =>
    fetchWithAuth(`${API_URL}/progress/lessons/${lessonId}/start`, {
      method: "POST",
    }),

  markLessonViewed: (lessonId) =>
    fetchWithAuth(`${API_URL}/progress/lessons/${lessonId}/viewed`, {
      method: "POST",
    }),

  updateLessonVideoProgress: (lessonId, payload) =>
    fetchWithAuth(`${API_URL}/progress/lessons/${lessonId}/video`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  markResourceViewed: (resourceId) =>
    fetchWithAuth(`${API_URL}/progress/resources/${resourceId}/viewed`, {
      method: "POST",
    }),

  updateResourceVideoProgress: (resourceId, payload) =>
    fetchWithAuth(`${API_URL}/progress/resources/${resourceId}/video`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
