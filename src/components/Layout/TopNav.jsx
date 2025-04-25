import React from 'react';
import './styles/TopNav.css';
import { faSearch, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TopNav = () => {
    return (
        <div className="top-nav">
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Search orders, customers..." />
            </div>
            <div className="nav-right">
                <button className="notification-btn">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="notification-badge">3</span>
                </button>
                <div className="profile">
                    <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
                    <span className="profile-name">Admin User</span>
                </div>
            </div>
        </div>
    );
};

export default TopNav;