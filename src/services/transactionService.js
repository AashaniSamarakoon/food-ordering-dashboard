import axios from 'axios';

const restaurantTransactionApi = axios.create({
    baseURL: 'http://localhost:8081/api/restaurant-transactions',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

restaurantTransactionApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        const restaurantId = localStorage.getItem('restaurantId');
        
        if (!token) {
            throw new Error('Authentication token required');
        }
        
        console.log('Current restaurantId:', restaurantId);
        console.log('Current token:', 'Present');
        
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        console.error('Restaurant Transaction API request error:', error);
        return Promise.reject(error);
    }
);

const transactionService = {
    // Get all restaurant transactions
    getRestaurantTransactions: async () => {
        try {
            const restaurantId = localStorage.getItem('restaurantId');
            if (!restaurantId) {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication required. Please log in again.');
                }
                
                // Try to get restaurant data from sync endpoint
                try {
                    const syncResponse = await axios({
                        method: 'GET',
                        url: 'http://localhost:8081/api/restaurants/sync',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });
                    
                    if (syncResponse.data && syncResponse.data.id) {
                        localStorage.setItem('restaurantId', syncResponse.data.id);
                        console.log('Retrieved and stored restaurant ID:', syncResponse.data.id);
                    } else {
                        throw new Error('Could not retrieve restaurant ID from sync');
                    }
                } catch (syncError) {
                    console.error('Error syncing restaurant data:', syncError);
                    throw new Error('Could not retrieve restaurant information. Please log in again.');
                }
            }
            
            // Retry getting the restaurant ID after potential sync
            const finalRestaurantId = localStorage.getItem('restaurantId');
            if (!finalRestaurantId) {
                throw new Error('Restaurant ID not found. Please log in again.');
            }
            
            console.log('Fetching transactions for restaurant:', finalRestaurantId);
            const response = await restaurantTransactionApi.get(`/${finalRestaurantId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching restaurant transactions:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Failed to fetch transactions');
            }
            throw error;
        }
    },

    // Sync transactions with payment service
    syncRestaurantTransactions: async () => {
        try {
            const restaurantId = localStorage.getItem('restaurantId');
            if (!restaurantId) {
                throw new Error('Restaurant ID not found. Please log in again.');
            }
            console.log('Syncing transactions for restaurant:', restaurantId);
            const response = await restaurantTransactionApi.post(`/sync/${restaurantId}`);
            return response.data;
        } catch (error) {
            console.error('Error syncing restaurant transactions:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Failed to sync transactions');
            }
            throw error;
        }
    },

    // Get all transactions (sorted by date)
    getAllTransactions: async () => {
        try {
            const transactions = await transactionService.getRestaurantTransactions();
            return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error fetching all transactions:', error);
            throw error;
        }
    }
};

export default transactionService;