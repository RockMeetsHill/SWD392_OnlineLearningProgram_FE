const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE_URL = `${API_URL}/admin/payroll`;

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

  // Export Excel trả blob, không parse json
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

// Payroll API functions
export const payrollAPI = {
  // GET /api/admin/payroll/summary?month=YYYY-MM
  getPayrollSummary: async (month) => {
    return fetchWithAuth(`${BASE_URL}/summary?month=${encodeURIComponent(month)}`, {
      method: "GET",
    });
  },

  // POST /api/admin/payroll/generate?month=YYYY-MM
  generatePayroll: async (month) => {
    return fetchWithAuth(`${BASE_URL}/generate?month=${encodeURIComponent(month)}`, {
      method: "POST",
    });
  },

  // GET /api/admin/payroll/batches?month=YYYY-MM
  getPayrollBatches: async (month) => {
    const url = month
      ? `${BASE_URL}/batches?month=${encodeURIComponent(month)}`
      : `${BASE_URL}/batches`;
    return fetchWithAuth(url, { method: "GET" });
  },

  // POST /api/admin/payroll/batch/:batchId/mark-paid
  markBatchPaid: async (batchId) => {
    return fetchWithAuth(`${BASE_URL}/batch/${batchId}/mark-paid`, {
      method: "POST",
    });
  },

  // GET /api/admin/payroll/export-summary?month=YYYY-MM  → trả về blob (Excel)
  exportPayrollSummary: async (month) => {
    const response = await fetchWithAuth(
      `${BASE_URL}/export-summary?month=${encodeURIComponent(month)}`,
      {
        method: "GET",
        responseType: "blob",
      }
    );

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const filename = match?.[1] || `payroll-summary-${month}.xlsx`;

    return { data: blob, filename };
  },

  // GET /api/admin/payroll/export-detail?month=YYYY-MM&instructorId=xxx → trả về blob (Excel)
  exportPayrollDetail: async (month, instructorId) => {
    const response = await fetchWithAuth(
      `${BASE_URL}/export-detail?month=${encodeURIComponent(month)}&instructorId=${encodeURIComponent(instructorId)}`,
      {
        method: "GET",
        responseType: "blob",
      }
    );

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const filename =
      match?.[1] || `payroll-detail-${month}-${instructorId}.xlsx`;

    return { data: blob, filename };
  },
};

// Backward compatibility – named exports cho code đang import trực tiếp
export const getPayrollSummary = payrollAPI.getPayrollSummary;
export const generatePayroll = payrollAPI.generatePayroll;
export const getPayrollBatches = payrollAPI.getPayrollBatches;
export const markBatchPaid = payrollAPI.markBatchPaid;
export const exportPayrollSummary = payrollAPI.exportPayrollSummary;
export const exportPayrollDetail = payrollAPI.exportPayrollDetail;

export default payrollAPI;