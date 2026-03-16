// src/services/api.js
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

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
    if (filters.status) queryParams.append("status", filters.status);
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

  // Submit course for review
  submitCourseForReview: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/submit`, {
      method: "POST",
    });
  },

  // Publish course directly (instructor)
  publishCourse: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/publish`, {
      method: "POST",
    });
  },

  // Flag course content as inappropriate (admin only)
  flagCourse: async (courseId, { reason } = {}) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/flag`, {
      method: "POST",
      body: JSON.stringify({ reason: reason || "" }),
    });
  },

  // Unflag course (admin only)
  unflagCourse: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/unflag`, {
      method: "POST",
    });
  },

  // Upload course thumbnail (instructor)
  uploadCourseThumbnail: async (courseId, file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("thumbnail", file);
    const response = await fetch(`${API_URL}/courses/${courseId}/thumbnail`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || "Upload failed");
    }
    return data;
  },

  // Approve course (admin only)
  approveCourse: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/approve`, {
      method: "POST",
    });
  },

  // Reject course (admin only)
  rejectCourse: async (courseId, adminNote) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/reject`, {
      method: "POST",
      body: JSON.stringify({ adminNote }),
    });
  },

  // Revise course (change from rejected to draft)
  reviseCourse: async (courseId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/revise`, {
      method: "PUT",
    });
  },

  // Get pending courses (admin only)
  getPendingCourses: async () => {
    return fetchWithAuth(`${API_URL}/courses/pending`, {
      method: "GET",
    });
  },

  // Get courses by instructor with optional status filter
  getInstructorCourses: async (instructorId, status = null) => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    const url = `${API_URL}/courses/instructor/${instructorId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return fetchWithAuth(url, {
      method: "GET",
    });
  },

  // Create module for a course (instructor)
  createModule: async (courseId, payload) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/modules`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Update module (instructor)
  updateModule: async (courseId, moduleId, payload) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/modules/${moduleId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Delete module (instructor)
  deleteModule: async (courseId, moduleId) => {
    return fetchWithAuth(`${API_URL}/courses/${courseId}/modules/${moduleId}`, {
      method: "DELETE",
    });
  },
};