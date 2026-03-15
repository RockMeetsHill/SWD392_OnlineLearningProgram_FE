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

const mapDashboardStats = (stats = {}) => ({
  instructors: Number(stats.users?.instructors || 0),
  students: Number(stats.users?.students || 0),
  courses: Number(stats.courses?.total || 0),
  pendingApprovals: Number(stats.courses?.pendingReview || 0),
  raw: stats,
});

export const adminDashboardAPI = {
  getOverviewStats: async () => {
    const data = await fetchWithAuth(`${API_URL}/admin/dashboard/stats`, {
      method: "GET",
    });

    return mapDashboardStats(data);
  },
};

export default adminDashboardAPI;
