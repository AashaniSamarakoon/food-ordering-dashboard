import axios from 'axios';

// Create a bank API client
const bankingApi = axios.create({
  baseURL: 'http://localhost:8083/api/banking',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
bankingApi.interceptors.request.use(
  config => {
    console.log(`Banking API Request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('Banking API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
bankingApi.interceptors.response.use(
  response => {
    console.log(`Banking API Response: ${response.status}`);
    return response;
  },
  error => {
    console.error('Banking API error:', error);
    return Promise.reject(error);
  }
);

// Banking service methods
const bankingService = {
  // Get all accounts
  getAllAccounts: async () => {
    try {
      // Temporarily using localStorage instead of API
      const accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
      return accounts;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  },

  // Get account by ID
  getAccountById: async (id) => {
    try {
      const response = await bankingApi.get(`/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching account details:', error);
      throw error;
    }
  },
  // Create new account
  createAccount: async (accountData) => {
    try {
      // Temporarily using localStorage instead of API
      const accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
      const newAccount = {
        ...accountData,
        id: Date.now(),
        balance: 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      accounts.push(newAccount);
      localStorage.setItem('bankAccounts', JSON.stringify(accounts));
      return newAccount;
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  },

  // Update existing account
  updateAccount: async (id, accountData) => {
    try {
      const response = await bankingApi.put(`/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (id) => {
    try {
      await bankingApi.delete(`/accounts/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  },
  
  // You can add more banking service methods as needed
  // For example, methods for handling transactions if you implement that feature
};

export default bankingService;