const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const getAuthToken = () => localStorage.getItem("token");

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (options.responseType === "blob") {
    if (!response.ok) {
      let message = "Request failed";
      try {
        const err = await response.json();
        message = err.error || err.message || message;
      } catch {
        // ignore parse error for binary responses
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

export const certificateAPI = {
  getMyCertificates: async () => {
    return fetchWithAuth(`${API_URL}/certificates`, { method: "GET" });
  },

  getCertificateById: async (certificateId) => {
    return fetchWithAuth(`${API_URL}/certificates/${certificateId}`, { method: "GET" });
  },

  getCertificatePreviewBlob: async (certificateId) => {
    const response = await fetchWithAuth(`${API_URL}/certificates/${certificateId}/file`, {
      method: "GET",
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    return response.blob();
  },

  downloadCertificatePdf: async (certificateId) => {
    const response = await fetchWithAuth(`${API_URL}/certificates/${certificateId}/download`, {
      method: "GET",
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const filename = match?.[1] || `certificate-${certificateId}.pdf`;

    return { blob, filename };
  },
};

export default certificateAPI;
