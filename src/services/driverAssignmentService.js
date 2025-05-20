import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const driverAssignmentService = {    assignDriver: async (orderId, driverDetails) => {
        const response = await axios.put(
            `${API_BASE_URL}/driver-assignments/${orderId}/assign`,
            driverDetails,
            {
                headers: getAuthHeader()
            }
        );
        return response.data;
    },    getDriverAssignment: async (orderId) => {
        const response = await axios.get(
            `${API_BASE_URL}/driver-assignments/${orderId}`,
            {
                headers: getAuthHeader()
            }
        );
        return response.data;
    },    updateDriverLocation: async (orderId, latitude, longitude) => {
        const response = await axios.put(
            `${API_BASE_URL}/driver-assignments/${orderId}/location`,
            null,
            {
                params: { latitude, longitude },
                headers: getAuthHeader()
            }
        );
        return response.data;
    },    markDeliveryComplete: async (orderId) => {
        await axios.put(
            `${API_BASE_URL}/driver-assignments/${orderId}/complete`,
            null,
            {
                headers: getAuthHeader()
            }
        );
    }
};

export default driverAssignmentService;
