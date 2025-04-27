// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../api';
//
// export const registerRestaurant = createAsyncThunk(
//     'auth/register',
//     async (restaurantData, { rejectWithValue }) => {
//         try {
//             const response = await api.post('/restaurants/register', restaurantData);
//             localStorage.setItem('token', response.data.token);
//             return response.data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data?.message || 'Registration failed');
//         }
//     }
// );
//
// export const login = createAsyncThunk(
//     'auth/login',
//     async (credentials, { rejectWithValue }) => {
//         try {
//             const response = await api.post('/auth/login', credentials);
//             localStorage.setItem('token', response.data.token);
//             return response.data;
//         } catch (err) {
//             return rejectWithValue(err.response?.data?.message || 'Invalid credentials');
//         }
//     }
// );
//
// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         token: localStorage.getItem('token') || null,
//         isAuthenticated: !!localStorage.getItem('token'),
//         isLoading: false,
//         error: null
//     },
//     reducers: {
//         logout: (state) => {
//             localStorage.removeItem('token');
//             state.user = null;
//             state.token = null;
//             state.isAuthenticated = false;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(registerRestaurant.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(registerRestaurant.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isAuthenticated = true;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//             })
//             .addCase(registerRestaurant.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             })
//             .addCase(login.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isAuthenticated = true;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             });
//     }
// });
//
// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

// authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// export const registerRestaurant = createAsyncThunk(
//     'auth/register',
//     async (restaurantData, { rejectWithValue }) => {
//         try {
//             // Mock API call for demonstration
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             // In a real app, you would make an actual API call here:
//             // const response = await api.post('/restaurants/register', restaurantData);

//             return {
//                 user: {
//                     email: restaurantData.email,
//                     restaurantName: restaurantData.restaurantName
//                 }
//             };
//         } catch (err) {
//             return rejectWithValue(err.response?.data?.message || 'Registration failed');
//         }
//     }
// );

// export const login = createAsyncThunk(
//     'auth/login',
//     async (credentials, { rejectWithValue }) => {
//         try {
//             if (credentials.email === 'admin@restaurant.com' &&
//                 credentials.password === 'password123') {
//                 await new Promise(resolve => setTimeout(resolve, 500));

//                 return {
//                     token: 'mock-jwt-token',
//                     user: {
//                         id: 1,
//                         name: 'Admin User',
//                         email: credentials.email,
//                         role: 'admin'
//                     }
//                 };
//             }
//             throw new Error('Invalid credentials');
//         } catch (err) {
//             return rejectWithValue(err.message);
//         }
//     }
// );

// // Add this to your authSlice's initialState
// const initialState = {
//     user: null,
//     token: localStorage.getItem('token') || null,
//     isAuthenticated: !!localStorage.getItem('token'), // This checks if token exists
//     isLoading: false,
//     error: null
// };

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         token: null,
//         isAuthenticated: false,
//         isLoading: false,
//         error: null
//     },
//     reducers: {
//         logout: (state) => {
//             localStorage.removeItem('token');
//             state.user = null;
//             state.token = null;
//             state.isAuthenticated = false;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isAuthenticated = true;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 localStorage.setItem('token', action.payload.token);
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             });
//     }
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const registerRestaurant = createAsyncThunk(
    'auth/register',
    async (restaurantData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/register', restaurantData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/authenticate', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Invalid credentials');
        }
    }
);

// authSlice.js
const authSlice = createSlice({
    name: 'auth',
    initialState: { isAuthenticated: false, status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerRestaurant.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerRestaurant.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
            })
            .addCase(registerRestaurant.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;