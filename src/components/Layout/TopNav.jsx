// import React from 'react';
// import './styles/TopNav.css';
// import { faSearch, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const TopNav = () => {
//     return (
//         <div className="top-nav">
//             <div className="search-bar">
//                 <FontAwesomeIcon icon={faSearch} className="search-icon" />
//                 <input type="text" placeholder="Search orders, customers..." />
//             </div>
//             <div className="nav-right">
//                 <button className="notification-btn">
//                     <FontAwesomeIcon icon={faBell} />
//                     <span className="notification-badge">3</span>
//                 </button>
//                 <div className="profile">
//                     <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//                     <span className="profile-name">Admin User</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TopNav;


import React, { useState } from 'react';
import './styles/TopNav.css';
import { faSearch, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TopNav = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const userInfo = useSelector(state => state.auth.userInfo);
    const notifications = [
        { id: 1, message: "New order received" },
        { id: 2, message: "Restaurant verification pending" },
        { id: 3, message: "Payment received" }
    ];

    const handleProfileClick = () => {
        navigate('/dashboard/profile');
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="top-nav">
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Search orders, customers..." />
            </div>
            <div className="nav-right">                <div className="notification-container">
                    <button className="notification-btn" onClick={toggleNotifications}>
                        <FontAwesomeIcon icon={faBell} />
                        <span className="notification-badge">{notifications.length}</span>
                    </button>
                    {showNotifications && (
                        <div className="notifications-dropdown">
                            <div className="notifications-header">
                                <h3>Notifications</h3>
                                <button className="close-btn" onClick={toggleNotifications}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="notifications-list">
                                {notifications.map(notification => (
                                    <div key={notification.id} className="notification-item">
                                        {notification.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="profile" onClick={handleProfileClick}>
                    <div className="profile-icon-placeholder">
                        {userInfo?.email ? userInfo.email.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="profile-name">{userInfo?.restaurantName || "Admin"}</span>
                </div>
            </div>
        </div>
    );
};

export default TopNav;