const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers, credentials: "include" });
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) throw new Error(data.error || data.message || response.statusText || "Request failed");
  return data;
};

export const quizAPI = {
  getQuizzes: (lessonId) =>
    fetchWithAuth(`${API_URL}/quizzes/lesson/${lessonId}`, { method: "GET" }),

  getQuizById: async (quizId) => {
    const data = await fetchWithAuth(`${API_URL}/quizzes/${quizId}`, { method: "GET" });
    return data.quiz != null ? data.quiz : data;
  },

  createQuiz: (lessonId, payload) =>
    fetchWithAuth(`${API_URL}/quizzes/lesson/${lessonId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createQuestion: (quizId, payload) =>
    fetchWithAuth(`${API_URL}/quizzes/${quizId}/questions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateQuestion: (questionId, payload) =>
    fetchWithAuth(`${API_URL}/quizzes/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteQuestion: (questionId) =>
    fetchWithAuth(`${API_URL}/quizzes/questions/${questionId}`, {
      method: "DELETE",
    }),

  updateAnswer: (answerId, payload) =>
    fetchWithAuth(`${API_URL}/quizzes/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteAnswer: (answerId) =>
    fetchWithAuth(`${API_URL}/quizzes/answers/${answerId}`, {
      method: "DELETE",
    }),

  createAnswer: (questionId, payload) =>
    fetchWithAuth(`${API_URL}/quizzes/questions/${questionId}/answers`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  submitQuiz: (quizId, answers) =>
    fetchWithAuth(`${API_URL}/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
};
