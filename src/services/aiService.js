const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers, credentials: "include" });
    const rawText = await response.text();
    const data = rawText ? JSON.parse(rawText) : {};

    if (!response.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Unexpected server response");
    }
    if (error instanceof TypeError) {
      throw new Error("Unable to reach the server");
    }
    throw error;
  }
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

  chatWithTutor: (lessonId, message, history = []) =>
    fetchWithAuth(`${API_URL}/ai/lessons/${lessonId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  submitSpeakingPractice: (lessonId, payload) =>
    fetchWithAuth(`${API_URL}/ai/lessons/${lessonId}/speaking`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSpeakingHistory: (lessonId) =>
    fetchWithAuth(`${API_URL}/ai/lessons/${lessonId}/speaking/history`, {
      method: "GET",
    }),
};
