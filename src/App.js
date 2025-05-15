import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantService } from './api';
import { syncRestaurantData, selectCurrentToken } from './components/Auth/authSlice';
import Sidebar from './components/Layout/Sidebar';
import TopNav from './components/Layout/TopNav';
import Dashboard from './components/Dashboard/Dashboard';
import MenuList from './components/Menu/MenuList';
import AddMenuItem from "./components/Menu/AddMenuItem";
import EditMenuItem from "./components/Menu/EditMenuItem";
import OrdersPage from "./components/Orders/OrdersPage";
import OrderDetails from "./components/Orders/OrderDetails";
import BankingPage from "./components/Banking/BankingPage";
import AboutPage from "./components/About/AboutPage";
import ProfilePage from "./components/Profile/ProfilePage";
import Onboarding from './components/Auth/Onboarding';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import CheckStatus from './components/Auth/CheckStatus';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function DashboardLayout() {
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);

    useEffect(() => {
        // When dashboard loads, if we have a token, ensure restaurant data is synced
        if (token) {
            // Try to sync restaurant data silently in the background
            dispatch(syncRestaurantData())
                .unwrap()
                .then(data => {
                    console.log('Restaurant data synced on dashboard load:', data);
                })
                .catch(error => {
                    console.warn('Could not sync restaurant data:', error);
                });
        }
    }, [dispatch, token]);

    return (
        <div className="App">
            <Sidebar />
            <TopNav />
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="menu" element={<MenuList />} />
                <Route path="menu/add" element={<AddMenuItem />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu/edit/:id" element={<EditMenuItem />} /> 
                <Route path="orders/:orderId" element={<OrderDetails />} />
                <Route path="banking" element={<BankingPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Onboarding />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/check-status" element={<CheckStatus />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard/*" element={<DashboardLayout />} />

                {/* Redirect to onboarding for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

export default App;




//
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Layout/Sidebar';
// import TopNav from './components/Layout/TopNav';
// import Dashboard from './components/Dashboard/Dashboard';
// import MenuList from './components/Menu/MenuList';
// import './App.css';
// import OrdersPage from "./components/Orders/OrdersPage";
// import OrderDetails from "./components/Orders/OrderDetails";
// import BankingPage from "./components/Banking/BankingPage";
// import AboutPage from "./components/About/AboutPage";
// import AddMenuItem from "./components/Menu/AddMenuItem";
//
// function App() {
//     return (
//         <Router>
//             <div className="App">
//                 <Sidebar />
//                 <TopNav />
//                 <Routes>
//                     <Route path="/" element={<Dashboard />} />
//                     <Route path="/menu" element={<MenuList />} />
//                     <Route path="/menu/add" element={<AddMenuItem />} />
//                     <Route path="/orders" element={<OrdersPage />} />
//                     <Route path="/orders/:orderId" element={<OrderDetails />} />
//                     <Route path="/banking" element={<BankingPage />} />
//                     <Route path="/about" element={<AboutPage />} />
//
//                 </Routes>
//             </div>
//         </Router>
//     );
// }
//
// export default App;