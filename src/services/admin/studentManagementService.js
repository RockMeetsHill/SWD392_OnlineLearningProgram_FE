const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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

/**
 * Map dữ liệu từ API (User) sang format Student cho frontend
 */
const mapUserToStudent = (user) => ({
  id: user.userId,
  name: user.fullName,
  email: user.email,
  phone: user.phoneNumber || null,
  currentLevel: user.currentLevel || null,
  isActive: user.isActive ?? true,
  roles: user.roles || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  enrollmentsCount: user._count?.enrollments || 0,
  avatar: null,
});

export const studentAPI = {
  // Get all students (filtered by role "student")
  getAllStudents: async () => {
    const data = await fetchWithAuth(`${API_URL}/users`, {
      method: "GET",
    });
    const students = data.filter((user) => user.roles.includes("student"));
    return students.map(mapUserToStudent);
  },

  // Get student by ID
  getStudentById: async (userId) => {
    const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "GET",
    });
    return mapUserToStudent(data);
  },

  // Toggle student active status
  toggleStudentStatus: async (userId, currentIsActive) => {
    const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !currentIsActive }),
    });
    return mapUserToStudent(data);
  },

  // Delete student
  deleteStudent: async (userId) => {
    const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });
    return data;
  },
};