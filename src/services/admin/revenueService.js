const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE_URL = `${API_URL}/admin/revenue`;

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  // ưu tiên token lưu riêng
  const directToken = localStorage.getItem("token");
  if (directToken) return directToken;

  // fallback theo kiểu cũ: token nằm trong user object
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token || null;
    } catch (error) {
      console.error("Error parsing user token:", error);
      return null;
    }
  }
  return null;
};

// Build query string
const buildQuery = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString();
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Chỉ set JSON content-type khi có body json
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // export CSV trả blob, không parse json
  if (options.responseType === "blob") {
    if (!response.ok) {
      let message = "Request failed";
      try {
        const err = await response.json();
        message = err.error || err.message || message;
      } catch {
        // ignore
      }
      throw new Error(message);
    }
    return response;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};

// cache đơn giản để tránh gọi lại detail nhiều lần
const orderDetailCache = new Map();

// Revenue API functions
export const revenueAPI = {
  // GET /api/admin/revenue/summary
  getRevenueSummary: async (filters = {}) => {
    const query = buildQuery(filters);
    const url = `${BASE_URL}/summary${query ? `?${query}` : ""}`;
    return fetchWithAuth(url, { method: "GET" });
  },

  // GET /api/admin/revenue/orders
  getRevenueOrders: async (filters = {}) => {
    const { includeInstructor, ...queryFilters } = filters || {};
    const query = buildQuery(queryFilters);
    const url = `${BASE_URL}/orders${query ? `?${query}` : ""}`;

    const listRes = await fetchWithAuth(url, { method: "GET" });

    // Chỉ enrich khi cần
    if (!includeInstructor) return listRes;

    const orders = listRes?.data || [];
    if (!orders.length) return listRes;

    const detailResults = await Promise.allSettled(
      orders.map(async (o) => {
        if (orderDetailCache.has(o.orderId)) {
          return orderDetailCache.get(o.orderId);
        }
        const detail = await fetchWithAuth(`${BASE_URL}/orders/${o.orderId}`, {
          method: "GET",
        });
        orderDetailCache.set(o.orderId, detail);
        return detail;
      }),
    );

    const detailMap = new Map();
    detailResults.forEach((r) => {
      if (r.status === "fulfilled" && r.value?.orderId) {
        detailMap.set(r.value.orderId, r.value);
      }
    });

    const enriched = orders.map((o) => {
      const detail = detailMap.get(o.orderId);
      if (!detail?.courses?.length) return o;

      const instructorByCourseId = new Map(
        detail.courses.map((c) => [c.courseId, c.instructor || null]),
      );

      return {
        ...o,
        courses: (o.courses || []).map((c) => ({
          ...c,
          instructor: c.instructor || instructorByCourseId.get(c.courseId) || null,
        })),
      };
    });

    return {
      ...listRes,
      data: enriched,
    };
  },

  // GET /api/admin/revenue/orders/:orderId
  getRevenueOrderDetail: async (orderId) => {
    return fetchWithAuth(`${BASE_URL}/orders/${orderId}`, {
      method: "GET",
    });
  },

  // GET /api/admin/revenue/transactions
  getRevenueTransactions: async (filters = {}) => {
    const query = buildQuery(filters);
    const url = `${BASE_URL}/transactions${query ? `?${query}` : ""}`;
    return fetchWithAuth(url, { method: "GET" });
  },

  // GET /api/admin/revenue/export
  exportRevenue: async (filters = {}) => {
    const query = buildQuery(filters);
    const url = `${BASE_URL}/export${query ? `?${query}` : ""}`;
    const response = await fetchWithAuth(url, {
      method: "GET",
      responseType: "blob",
    });

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const filename = match?.[1] || `revenue_${Date.now()}.csv`;

    return { blob, filename };
  },
};

// Giữ backward compatibility với code cũ đang import named functions
export const getRevenueSummary = revenueAPI.getRevenueSummary;
export const getRevenueOrders = revenueAPI.getRevenueOrders;
export const getRevenueOrderDetail = revenueAPI.getRevenueOrderDetail;
export const getRevenueTransactions = revenueAPI.getRevenueTransactions;
export const exportRevenue = revenueAPI.exportRevenue;

export default revenueAPI;