import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

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
      // Log that we're making the request (but don't log the password)
      console.log('Attempting login with email:', credentials.email);
      
      const response = await api({
        method: 'POST',
        url: '/auth/authenticate',
        data: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', response.data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return response.data;
    } catch (err) {
      // Log the full error for debugging
      console.error("Login error:", err);
      
      if (!err.response) {
        return rejectWithValue({
          message: 'Network error - could not connect to server',
          status: 0
        });
      }

      // Log the error data for debugging
      console.error('Error response data:', err.response.data);
      console.error('Error status code:', err.response.status);

      // Handle 403 errors (account not verified)
      if (err.response.status === 403) {
        // Extract the error message from the response
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           'Your account has not been verified yet.';
                           
        return rejectWithValue({
          message: errorMessage,
          status: 403,
          isVerificationError: true
        });
      }
      
      // Handle other error responses
      const errorData = err.response.data || {};
      return rejectWithValue({
        message: errorData.message || errorData.error || 'Authentication failed',
        status: err.response.status
      });
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
  isLoading: false,
  registrationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  verificationMessage: null // New field to store verification status messages
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
      });
  }
});

export const { logout, clearRegistrationStatus, clearError } = authSlice.actions;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectRegistrationStatus = (state) => state.auth.registrationStatus;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;