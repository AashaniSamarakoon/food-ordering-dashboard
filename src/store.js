import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: { isAuthenticated: false },
    reducers: {
        login: (state) => { state.isAuthenticated = true },
        logout: (state) => { state.isAuthenticated = false },
        registerRestaurant: (state, action) => {
            // Handle registration logic here
        }
    },
});

export const { login, logout, registerRestaurant } = authSlice.actions;
export default configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});