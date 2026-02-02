const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const paymentAPI = {
    // Create payment for a course
    createPayment: async (courseId) => {
        const response = await fetch(`${API_BASE_URL}/payments/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include', // Gửi cookies nếu backend dùng cookie
            body: JSON.stringify({ courseId: parseInt(courseId) }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create payment');
        }

        return response.json();
    },

    // Get payment status
    getPaymentStatus: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/payments/status/${orderId}`, {
            headers: getAuthHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get payment status');
        }

        return response.json();
    },

    // Get user's payment history
    getPaymentHistory: async () => {
        const response = await fetch(`${API_BASE_URL}/payments/history`, {
            headers: getAuthHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get payment history');
        }

        return response.json();
    },
};

export default paymentAPI;