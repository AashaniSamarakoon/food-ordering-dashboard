import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import TopNav from './components/Layout/TopNav';
import Dashboard from './components/Dashboard/Dashboard';
import MenuList from './components/Menu/MenuList';
import AddMenuItem from "./components/Menu/AddMenuItem";
import OrdersPage from "./components/Orders/OrdersPage";
import OrderDetails from "./components/Orders/OrderDetails";
import BankingPage from "./components/Banking/BankingPage";
import AboutPage from "./components/About/AboutPage";
import ProfilePage from "./components/Profile/ProfilePage";
import Onboarding from './components/Auth/Onboarding';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import './App.css';

function DashboardLayout() {
    return (
        <div className="App">
            <Sidebar />
            <TopNav />
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="menu" element={<MenuList />} />
                <Route path="menu/add" element={<AddMenuItem />} />
                <Route path="orders" element={<OrdersPage />} />
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

                {/* Dashboard Routes */}
                <Route path="/dashboard/*" element={<DashboardLayout />} />

                {/* Redirect to onboarding for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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