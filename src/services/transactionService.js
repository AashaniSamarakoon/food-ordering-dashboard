import axios from 'axios';

// Create separate APIs for different transaction sources
const restaurantTransactionApi = axios.create({
    baseURL: 'http://localhost:8081/api/restaurant/transactions', // Restaurant service
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// const bankingTransactionApi = axios.create({
//     baseURL: 'http://localhost:8083/api/banking/transactions', // Banking service
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// });

// Request interceptor for restaurant transactions
restaurantTransactionApi.interceptors.request.use(
    config => {
        console.log(`Restaurant Transaction API Request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Restaurant Transaction API request error:', error);
        return Promise.reject(error);
    }
);

// // Request interceptor for banking transactions
// bankingTransactionApi.interceptors.request.use(
//     config => {
//         console.log(`Banking Transaction API Request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => {
//         console.error('Banking Transaction API request error:', error);
//         return Promise.reject(error);
//     }
// );

const transactionService = {
    // Get all restaurant transactions
    getRestaurantTransactions: async () => {
        try {
            const restaurantId = localStorage.getItem('restaurantId');
            if (!restaurantId) {
                throw new Error('Restaurant ID not found');
            }
            const response = await restaurantTransactionApi.get(`/restaurant/${restaurantId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching restaurant transactions:', error);
            throw error;
        }
    },

    // // Get all banking transactions
    // getBankingTransactions: async () => {
    //     try {
    //         const response = await bankingTransactionApi.get('/');
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching banking transactions:', error);
    //         throw error;
    //     }
    // },

    // // Sync transactions with payment service
    // syncRestaurantTransactions: async () => {
    //     try {
    //         const restaurantId = localStorage.getItem('restaurantId');
    //         if (!restaurantId) {
    //             throw new Error('Restaurant ID not found');
    //         }
    //         const response = await restaurantTransactionApi.post(`/sync/${restaurantId}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error syncing restaurant transactions:', error);
    //         throw error;
    //     }
    // },    // Get all transactions (currently only restaurant transactions)
    getAllTransactions: async () => {
        try {
            const restaurantTransactions = await transactionService.getRestaurantTransactions();

            // Sort transactions by date
            const allTransactions = restaurantTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            return allTransactions;
        } catch (error) {
            console.error('Error fetching all transactions:', error);
            throw error;
        }
    }
};

export default transactionService;