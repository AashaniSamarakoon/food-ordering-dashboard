import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

});


// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 403) {
        // Handle 403 errors specifically
        if (error.config.url.includes('/auth/register')) {
          error.response.data.message = "Registration failed. Please check your details or try again later.";
        }
      }
      return Promise.reject(error);
    }
  );
  

export default api;