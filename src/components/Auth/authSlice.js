import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import axios from 'axios';

// Async Thunks
export const registerRestaurant = createAsyncThunk(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await api({
        method: 'POST',
        url: '/auth/register',
        data: registrationData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      
      const errorData = err.response.data || {};
      return rejectWithValue({
        message: errorData.message || 'Registration failed',
        status: err.response.status,
        errors: errorData.errors
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with email:', credentials.email);
      
      // Login API call
      const response = await api({
        method: 'POST',
        url: '/auth/authenticate',
        data: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login successful:', response.data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Wait a moment for the token to be properly stored
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Call the sync endpoint to make sure restaurant data is synced
        try {
          console.log('Starting restaurant sync after login...');
          
          // Use the working GET endpoint exactly as in Postman
          const syncResponse = await axios({
            method: 'GET',
            url: 'http://localhost:8081/api/restaurants/sync',
            headers: {
              'Authorization': `Bearer ${response.data.token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
          
          console.log('Restaurant sync successful:', syncResponse.data);
          response.data.restaurantData = syncResponse.data;
          
        } catch (syncError) {
          console.error('Restaurant sync error:', syncError);
          if (syncError.response) {
            console.error('Sync error details:', {
              status: syncError.response.status,
              data: syncError.response.data
            });
          }
        }
      }

      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      
      if (!err.response) {
        return rejectWithValue({
          message: 'Network error - could not connect to server',
          status: 0
        });
      }

      const errorData = err.response.data || {};
      return rejectWithValue({
        message: errorData.message || 'Authentication failed',
        status: err.response.status,
        errors: errorData.errors
      });
    }
  }
);

// Add the missing syncRestaurantData thunk
export const syncRestaurantData = createAsyncThunk(
  'auth/syncRestaurantData',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token from state or localStorage
      const token = getState().auth.token || localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token available for sync');
        return rejectWithValue({ message: 'No authentication token available' });
      }
      
      console.log('Syncing restaurant data with token:', token.substring(0, 15) + '...');
      
      // Make a direct axios call to ensure proper headers
      const response = await axios({
        method: 'GET',
        url: 'http://localhost:8081/api/restaurants/sync',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Restaurant sync successful:', response.data);
      return response.data;
    } catch (err) {
      console.error('Restaurant sync error in thunk:', err);
      
      // Extract detailed error information
      const errorData = {
        message: err.response?.data?.message || err.message || 'Failed to sync restaurant data',
        status: err.response?.status,
        data: err.response?.data
      };
      
      console.error('Error details:', errorData);
      return rejectWithValue(errorData);
    }
  }
);

const initialState = {
  token: localStorage.getItem('token') || null,
  userInfo: {
    email: null,
    restaurantName: null,
    role: null,
    isVerified: false
  },
  restaurantInfo: null,
  isLoading: false,
  registrationStatus: 'idle',
  syncStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  syncError: null,
  error: null,
  verificationMessage: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      return initialState;
    },
    clearRegistrationStatus: (state) => {
      state.registrationStatus = 'idle';
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(registerRestaurant.pending, (state) => {
        state.isLoading = true;
        state.registrationStatus = 'loading';
        state.error = null;
      })
      .addCase(registerRestaurant.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationStatus = 'succeeded';
        state.error = null;
      })
      .addCase(registerRestaurant.rejected, (state, action) => {
        state.isLoading = false;
        state.registrationStatus = 'failed';
        state.error = {
          message: action.payload?.message || 'Registration failed',
          status: action.payload?.status,
          errors: action.payload?.errors
        };
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userInfo = {
          email: action.payload.email,
          restaurantName: action.payload.restaurantName,
          role: action.payload.role,
          isVerified: action.payload.isVerified
        };
        // Store restaurant data if available
        if (action.payload.restaurantData) {
          state.restaurantInfo = action.payload.restaurantData;
          state.syncStatus = 'succeeded';
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.token = null;
        state.error = {
          message: action.payload?.message || 'Login failed',
          status: action.payload?.status,
          errors: action.payload?.errors
        };
      })
      
      // Restaurant sync
      .addCase(syncRestaurantData.pending, (state) => {
        state.syncStatus = 'loading';
        state.syncError = null;
      })
      .addCase(syncRestaurantData.fulfilled, (state, action) => {
        state.syncStatus = 'succeeded';
        state.restaurantInfo = action.payload;
        state.syncError = null;
      })
      .addCase(syncRestaurantData.rejected, (state, action) => {
        state.syncStatus = 'failed';
        state.syncError = action.payload || 'Failed to sync restaurant data';
      });
  }
});

export const { logout, clearRegistrationStatus, clearError } = authSlice.actions;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectRestaurantInfo = (state) => state.auth.restaurantInfo;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectRegistrationStatus = (state) => state.auth.registrationStatus;
export const selectAuthError = (state) => state.auth.error;
export const selectSyncStatus = (state) => state.auth.syncStatus;

export default authSlice.reducer;