// src/services/api.js
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

// Course API functions
export const courseAPI = {
  // Get all courses with optional filters
  getCourses: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.level && filters.level.length > 0) {
      filters.level.forEach(l => queryParams.append("level", l));
    }
    if (filters.price && filters.price.length > 0) {
      filters.price.forEach(p => queryParams.append("price", p));
    }
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const url = `${API_URL}/courses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return fetchWithAuth(url, { method: "GET" });
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}`, {
      method: "GET",
    });
  },

  // Enroll in a course
  enrollInCourse: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/enroll`, {
      method: "POST",
    });
  },

  // Create course (for lecturers)
  createCourse: async (courseData) => {
    return fetchWithAuth(`${API_URL}/courses`, {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  },

  // Update course (for lecturers)
  updateCourse: async (courseId, courseData) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
  },

  // Delete course (for lecturers)
  deleteCourse: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}`, {
      method: "DELETE",
    });
  },
};