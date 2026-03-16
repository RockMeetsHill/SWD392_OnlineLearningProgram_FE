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
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.error || data.message || "Request failed");
    }

    return data;
};

export const assignmentAPI = {
    getAssignmentByLesson: (lessonId) =>
        fetchWithAuth(`${API_URL}/assignments/lessons/${lessonId}`, {
            method: "GET",
        }),

    submitAssignment: (lessonId, payload) =>
        fetchWithAuth(`${API_URL}/assignments/lessons/${lessonId}/submissions`, {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listLessonSubmissions: (lessonId) =>
        fetchWithAuth(`${API_URL}/assignments/lessons/${lessonId}/submissions`, {
            method: "GET",
        }),

    gradeSubmission: (submissionId, payload) =>
        fetchWithAuth(`${API_URL}/assignments/submissions/${submissionId}/grade`, {
            method: "PUT",
            body: JSON.stringify(payload),
        }),
};

export default assignmentAPI;
