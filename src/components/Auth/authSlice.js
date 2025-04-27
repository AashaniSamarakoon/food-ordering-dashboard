// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../api';

// // Register action
// export const registerRestaurant = createAsyncThunk(
//     'auth/registerRestaurant',
//     async (registrationData, { rejectWithValue }) => {
//         try {
//             const response = await api.post('/auth/register', registrationData);
//             return response.data;
//         } catch (err) {
//             // Return the complete error response from backend
//             return rejectWithValue(err.response?.data || {
//                 message: err.message || 'Registration failed'
//             });
//         }
//     }
// );

// // Login action
// export const login = createAsyncThunk(
//     'auth/login',
//     async (credentials, { rejectWithValue }) => {
//         try {
//             const response = await api.post('auth/authenticate', credentials);
//             localStorage.setItem('token', response.data.token);
//             return response.data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data?.message || 'Login failed');
//         }
//     }
// );


// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         token: localStorage.getItem('token') || null,
//         isAuthenticated: !!localStorage.getItem('token'),
//         isLoading: false,
//         error: null,
//         registrationStatus: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
//     },
//     reducers: {
//         clearRegistrationStatus: (state) => {
//             state.registrationStatus = 'idle';
//             state.error = null;
//         },
//         logout: (state) => {
//             localStorage.removeItem('token');
//             state.user = null;
//             state.token = null;
//             state.isAuthenticated = false;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Registration cases
//             .addCase(registerRestaurant.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//                 state.registrationStatus = 'loading';
//             })
//             .addCase(registerRestaurant.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.registrationStatus = 'succeeded';
//                 state.error = null;
//             })
//             .addCase(registerRestaurant.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.registrationStatus = 'failed';
                
//                 // Handle CORS/preflight errors
//                 if (action.error?.message?.includes('Network Error')) {
//                     state.error = "Cannot connect to server. Please check your connection.";
//                 } 
//                 // Handle 403 errors
//                 else if (action.payload?.status === 403) {
//                     state.error = action.payload?.message || "Registration forbidden. Please contact support.";
//                 }
//                 // Handle other errors
//                 else {
//                     state.error = action.payload?.message || 
//                                  action.error?.message || 
//                                  'Registration failed. Please try again.';
//                 }
//             })
            
//             // Login cases
//             .addCase(login.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isAuthenticated = true;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 state.error = null;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload || 'Login failed';
//             });
//     }
// });

// export const { clearRegistrationStatus, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Register action
export const registerRestaurant = createAsyncThunk(
    'auth/registerRestaurant',
    async (registrationData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', registrationData);
            return response.data;
        } catch (err) {
            // Return the complete error response from backend
            return rejectWithValue(err.response?.data || {
                message: err.message || 'Registration failed'
            });
        }
    }
);

// Login action
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('auth/authenticate', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

// Add this to your authSlice.js
export const checkEmailAvailability = createAsyncThunk(
    'auth/checkEmailAvailability',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || {
                message: err.message || 'Email check failed'
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        isLoading: false,
        error: null,
        registrationStatus: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
        clearRegistrationStatus: (state) => {
            state.registrationStatus = 'idle';
            state.error = null;
        },
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Registration cases
            .addCase(registerRestaurant.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.registrationStatus = 'loading';
            })
            .addCase(registerRestaurant.fulfilled, (state, action) => {
                state.isLoading = false;
                state.registrationStatus = 'succeeded';
                state.error = null;
            })
            .addCase(registerRestaurant.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 
                             action.error?.message || 
                             'Registration failed';
                state.registrationStatus = 'failed';
            })
            
            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
            });
    }
});

export const { clearRegistrationStatus, logout } = authSlice.actions;
export default authSlice.reducer;