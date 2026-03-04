const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "");
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

/**
 * Map dữ liệu từ API (User) sang format Instructor cho frontend
 */
const mapUserToInstructor = (user) => ({
  id: user.userId,
  name: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber || null,
  currentLevel: user.currentLevel || null,
  isActive: user.isActive ?? true,
  roles: user.roles || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  coursesCount: user._count?.coursesAsInstructor || 0,
  avatar: null,
});

// Instructor API functions
export const instructorAPI = {
  // Get all instructors (filtered by role "instructor")
  getAllInstructors: async () => {
    const data = await fetchWithAuth(`${API_URL}/users`, {
      method: "GET",
    });
    const instructors = data.filter((user) =>
      user.roles.includes("instructor"),
    );
    return instructors.map(mapUserToInstructor);
  },

  // Get instructor by ID
  getInstructorById: async (userId) => {
    const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "GET",
    });
    return mapUserToInstructor(data);
  },

  // Create a new instructor account
  createInstructor: async (instructorData) => {
    const payload = {
      name: instructorData.name,
      email: instructorData.email,
      password: instructorData.password,
      roles: ["instructor"],
    };
    if (instructorData.phoneNumber)
      payload.phoneNumber = instructorData.phoneNumber;
    if (instructorData.currentLevel)
      payload.currentLevel = instructorData.currentLevel;

    const data = await fetchWithAuth(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapUserToInstructor(data);
  },

  // Update instructor information
  updateInstructor: async (userId, instructorData) => {
    const payload = {};
    if (instructorData.name) payload.name = instructorData.name;
    if (instructorData.email) payload.email = instructorData.email;
    if (instructorData.password) payload.password = instructorData.password;
    if (typeof instructorData.isActive === "boolean") {
      payload.isActive = instructorData.isActive;
    }
    if (instructorData.phoneNumber !== undefined)
      payload.phoneNumber = instructorData.phoneNumber;
    if (instructorData.currentLevel)
      payload.currentLevel = instructorData.currentLevel;

    const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapUserToInstructor(data);
  },

  // Toggle instructor active status
  toggleInstructorStatus: async (userId, currentIsActive) => {
    const data = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !currentIsActive }),
    });
    return mapUserToInstructor(data);
  },

  // Delete instructor account
  deleteInstructor: async (userId) => {
    return fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });
  },
};
