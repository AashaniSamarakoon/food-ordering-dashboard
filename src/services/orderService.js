import axios from 'axios';

// Create an order API client
const orderApi = axios.create({
    baseURL: 'http://localhost:8081/api/orders',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for CORS and authentication
});

// Add auth token to every request
orderApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Order API request error:', error);
        return Promise.reject(error);
    }
);

// Handle responses
orderApi.interceptors.response.use(
    response => response,
    error => {
        console.error('Order API error:', error);
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

const orderService = {    // Get all orders for the restaurant
    getAllOrders: async () => {
        try {
            const response = await orderApi.get('/my-restaurant');
            return response.data.map(order => ({
                id: order.id,
                orderNumber: order.id,
                customerName: order.customer,
                contact: order.contact,
                totalAmount: order.total,
                status: order.status,
                orderTime: order.createdAt,
                deliveryType: order.deliveryType,
                pickupTime: order.pickupTime,
                items: new Array(order.itemCount).fill({}) // Convert itemCount to items array
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Get orders by status
    getOrdersByStatus: async (status) => {
        try {
            // For now, get all orders and filter on the client side
            // since the backend endpoint might be returning different format
            const allOrders = await orderService.getAllOrders();
            return allOrders.filter(order => order.status === status);
        } catch (error) {
            console.error('Error fetching orders by status:', error);
            throw error;
        }
    },

    // Get single order details
    getOrderById: async (orderId) => {
        try {
            const response = await orderApi.get(`/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await orderApi.patch(`/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Update order
    updateOrder: async (orderId, orderData) => {
        try {
            const response = await orderApi.put(`/${orderId}`, orderData);
            return response.data;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    },

    // Get real-time order status (if supported by backend)
    getOrderStatus: async (orderId) => {
        try {
            const response = await orderApi.get(`/${orderId}/status`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order status:', error);
            throw error;
        }
    }
};

export default orderService;
