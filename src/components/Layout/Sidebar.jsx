import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Sidebar.css';
import {
    faHome,
    faUtensils,
    faUsers,
    faCog,
    faSignOutAlt, 
    faClipboardList, 
    faPiggyBank, 
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from './logo.png'; // Make sure to add your logo image in the same folder

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logo} alt="Quick Serve Logo" className="logo-image" />
                <span>Quick Serve</span>
            </div>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className="nav-item">
                    <FontAwesomeIcon icon={faHome} className="nav-icon" />
                    <span>Dashboard</span>
                </Link>
                <Link to="/dashboard/menu" className="nav-item">
                    <FontAwesomeIcon icon={faUtensils} className="nav-icon" />
                    <span>Menu Items</span>
                </Link>
                <Link to="/dashboard/orders" className="nav-item">
                    <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
                    <span>Orders</span>
                </Link>
                <Link to="/dashboard/banking" className="nav-item">
                    <FontAwesomeIcon icon={faPiggyBank} className="nav-icon" />
                    <span>Banking</span>
                </Link>
                <Link to="/dashboard/customers" className="nav-item">
                    <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                    <span>Customers</span>
                </Link>
                <Link to="/dashboard/about" className="nav-item">
                    <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                    <span>About Us</span>
                </Link>
                <Link to="/dashboard/settings" className="nav-item">
                    <FontAwesomeIcon icon={faCog} className="nav-icon" />
                    <span>Settings</span>
                </Link>
            </nav>
            <div className="sidebar-footer">
                <a href="#" className="nav-item">
                    <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                    <span>Logout</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;