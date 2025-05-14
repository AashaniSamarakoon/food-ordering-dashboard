// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   withCredentials: true
// });

// // Request interceptor
// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//       localStorage.removeItem('token');
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

// Main API instance (original service)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  config => {
    console.log(`Making ${config.method?.toUpperCase() || 'GET'} request to: ${config.baseURL}${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: JSON.stringify(error.response?.data)
      });
    } else if (error.request) {
      console.error('No response received from API');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Update the restaurant service API instance for better auth handling
const restaurantServiceApi = axios.create({
  baseURL: 'http://localhost:8081/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add proper auth header to every request
restaurantServiceApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

restaurantServiceApi.interceptors.response.use(
  response => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`Error response from ${error.config?.url}:`, {
        status: error.response.status,
        data: error.response.data,
      });
      
      if (error.response.status === 401) {
        console.warn('Authentication token expired or invalid, clearing token');
        localStorage.removeItem('token');
      } else if (error.response.status === 403) {
        console.warn('User does not have required permissions');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Menu item API service (uses the restaurant service on port 8081)
export const menuItemService = {
  // Get all menu items (authenticated)
  getAllMenuItems: async () => {
    try {
      const response = await restaurantServiceApi.get('/menu-items/my-restaurant');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  // Get public menu items for a specific restaurant (no auth required)
  getPublicMenuItems: async (restaurantId = 1) => {
    try {
      const response = await restaurantServiceApi.get(`/menu-items/restaurant/${restaurantId}`);
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching public menu items:', error);
      throw error;
    }
  },

  // Create new menu item
  createMenuItem: async (menuItemData) => {
    try {
      console.log('Making API request to create menu item:', menuItemData);
      
      const response = await restaurantServiceApi.post('/menu-items', menuItemData);
      console.log('Successful menu item creation:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request error:', error.message);
      }
      throw error;
    }
  },

  // Create menu item with image upload
  createMenuItemWithImage: async (formData) => {
    try {
      const response = await restaurantServiceApi.post('/menu-items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating menu item with image:', error);
      throw error;
    }
  },

  // Update menu item
  updateMenuItem: async (id, menuItemData) => {
    try {
      const response = await restaurantServiceApi.put(`/menu-items/${id}`, menuItemData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete menu item
  deleteMenuItem: async (id) => {
    try {
      await restaurantServiceApi.delete(`/menu-items/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Update menu item status
  updateMenuItemStatus: async (id, status) => {
    try {
      const response = await restaurantServiceApi.patch(`/menu-items/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item status:', error);
      throw error;
    }
  },

  // Get single menu item
  getMenuItem: async (id, restaurantId = 1) => {
    try {
      const response = await restaurantServiceApi.get(`/menu-items/${id}?restaurantId=${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }
};

// Restaurant management service
export const restaurantService = {
  checkAndCreateRestaurant: async () => {
    try {
      // Try to get current user's restaurant
      await menuItemService.getAllMenuItems();
      return true; // Restaurant exists
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          // Restaurant doesn't exist, create one
          const defaultRestaurant = {
            name: "My Restaurant",
            description: "A great place to eat",
            address: "123 Main St",
            phone: "555-1234",
            email: "restaurant@example.com"
          };
          
          const response = await restaurantServiceApi.post('/restaurants', defaultRestaurant);
          console.log('Restaurant created:', response.data);
          return true;
        } catch (createError) {
          console.error('Failed to create restaurant:', createError);
          return false;
        }
      }
      return false;
    }
  }
};

export default api;