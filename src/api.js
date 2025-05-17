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
// import { makeXhrRequest } from './utils/apiUtilsXhr';

const logApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    console.error('No response received');
    console.error('Request:', error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }
  console.error('Config:', error.config);
};

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
    
    // Add content-type for authentication request explicitly
    if (config.url && config.url.includes('/auth/authenticate')) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
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
      
      if (error.response.status === 401) {
        console.warn('Authentication token expired or invalid, clearing token');
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      console.error('No response received from API');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Restaurant service API instance
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
    console.log(`Restaurant API Request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Restaurant API request error:', error);
    return Promise.reject(error);
  }
);

restaurantServiceApi.interceptors.response.use(
  response => {
    console.log(`Restaurant API response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  error => {
    if (error.response) {
      console.error('Restaurant API error response:', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.response.status === 401) {
        console.warn('Authentication token expired or invalid, clearing token');
        localStorage.removeItem('token');
      } else if (error.response.status === 403) {
        console.warn('User does not have required permissions');
      }
    } else if (error.request) {
      console.error('No response received from restaurant API:', error.request);
    } else {
      console.error('Restaurant API request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Restaurant service functions
export const restaurantService = {
  // Sync restaurant data from auth service
  syncRestaurantData: async () => {
    try {
      console.log('Making direct call to restaurant sync API...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token available for restaurant sync');
        throw new Error('Authentication token required');
      }
      
      // Make a direct axios call instead of using the instance
      const response = await axios({
        method: 'GET',
        url: 'http://localhost:8081/api/restaurants/sync',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Restaurant sync response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Restaurant sync error in service:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },
  // Get restaurant details for current user
  getRestaurantDetails: async () => {
    try {
      const response = await restaurantServiceApi.get('/restaurants/my-restaurant');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw error;
    }
  },
  
  // Update restaurant details
  updateRestaurantDetails: async (restaurantData) => {
    try {
      const response = await restaurantServiceApi.put('/restaurants/my-restaurant', restaurantData);
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant details:', error);
      throw error;
    }
  },
  
  // Check and create restaurant if needed
  checkAndCreateRestaurant: async () => {
    try {
      // First, try to get current user's restaurant
      try {
        const restaurant = await restaurantService.getRestaurantDetails();
        console.log('Restaurant exists:', restaurant);
        return true;
      } catch (error) {
        // If restaurant doesn't exist, try to sync
        if (error.response?.status === 404) {
          try {
            const syncedRestaurant = await restaurantService.syncRestaurantData();
            console.log('Restaurant synced successfully:', syncedRestaurant);
            return true;
          } catch (syncError) {
            console.error('Restaurant sync failed:', syncError);
            return false;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('Restaurant check/create failed:', error);
      return false;
    }
  }
};

// Menu item API service (uses the restaurant service on port 8081)
export const menuItemService = {
  // Get all menu items (authenticated)
// Inside your menuItemService object:

// In your menuItemService, modify getAllMenuItems to ensure imageUrl is consistent:

getAllMenuItems: async () => {
  try {
    console.log('Fetching all menu items...');
    const response = await restaurantServiceApi.get('/menu-items/my-restaurant');
    console.log('Menu items API response:', response);
    
    let items = [];
    
    // If the response has a 'content' property, it's paginated
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
      items = response.data.content;
    }
    // If it's directly an array, use it
    else if (Array.isArray(response.data)) {
      items = response.data;
    }
    
    // Ensure each item has an imageUrl property (even if empty)
    const processedItems = items.map(item => ({
      ...item,
      imageUrl: item.imageUrl || "" // Ensure imageUrl exists
    }));
    
    return processedItems;
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
    console.log('Creating menu item with data:', menuItemData);
    
    // Create a copy of the data to avoid modifying the original
    const apiData = {...menuItemData};
    
    // Ensure status is in correct format if not already
    if (apiData.status === 'Available') {
      apiData.status = 'AVAILABLE';
    } else if (apiData.status === 'Out of Stock') {
      apiData.status = 'OUT_OF_STOCK';
    }
    
    console.log('Sending to API:', apiData);
    
    const response = await restaurantServiceApi.post('/menu-items', apiData);
    console.log('Menu item created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
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
    // Create a copy of the data to avoid modifying the original
    const apiData = {...menuItemData};
    
    // Ensure status is in correct format if not already
    if (apiData.status === 'Available') {
      apiData.status = 'AVAILABLE';
    } else if (apiData.status === 'Out of Stock') {
      apiData.status = 'OUT_OF_STOCK';
    }
    
    const response = await restaurantServiceApi.put(`/menu-items/${id}`, apiData);
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

export default api;