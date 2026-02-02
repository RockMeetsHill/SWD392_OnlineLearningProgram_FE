const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    } catch (error) {
      console.error("Error parsing user token:", error);
      return null;
    }
  }
  return null;
};

// Helper function to make authenticated requests
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

// Dashboard API functions
export const dashboardAPI = {
  // Get enrolled courses for current student
  getEnrolledCourses: async () => {
    return fetchWithAuth(`${API_URL}/courses?enrolled=true`, {
      method: "GET",
    });
  },

  // Get courses by student ID
  getCoursesByStudentId: async (studentId) => {
    return fetchWithAuth(`${API_URL}/courses/student/${studentId}`, {
      method: "GET",
    });
  },

  // Get user progress for all courses
  getUserProgress: async () => {
    return fetchWithAuth(`${API_URL}/progress/user`, {
      method: "GET",
    });
  },

  // Get progress for specific course
  getCourseProgress: async (courseId) => {
    return fetchWithAuth(`${API_URL}/progress/courses/${courseId}`, {
      method: "GET",
    });
  },

  // Update lesson progress
  updateLessonProgress: async (lessonId, progressData) => {
    return fetchWithAuth(`${API_URL}/progress/lessons/${lessonId}`, {
      method: "POST",
      body: JSON.stringify(progressData),
    });
  },
};