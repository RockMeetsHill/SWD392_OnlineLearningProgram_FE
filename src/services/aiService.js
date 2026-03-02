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

export const aiAPI = {
  generateQuiz: (lessonId, numQuestions = 5, existingQuestionTexts = []) =>
    fetchWithAuth(`${API_URL}/ai/lessons/${lessonId}/generate-quiz`, {
      method: "POST",
      body: JSON.stringify({
        numQuestions,
        existingQuestionTexts: Array.isArray(existingQuestionTexts) ? existingQuestionTexts : [],
      }),
    }),

  applyGeneratedQuiz: (lessonId, payload) =>
    fetchWithAuth(`${API_URL}/ai/lessons/${lessonId}/apply-quiz`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  chatWithTutor: (lessonId, message) =>
    fetchWithAuth(`${API_URL}/ai/lessons/${lessonId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
