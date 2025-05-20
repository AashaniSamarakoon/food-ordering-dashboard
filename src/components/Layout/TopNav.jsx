import React, { useState, useEffect } from 'react';
import './styles/TopNav.css';
import { faSearch, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { initializeNotifications, closeNotifications } from '../../services/notificationService';

const TopNav = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [ws, setWs] = useState(null);
    const userInfo = useSelector(state => state.auth.userInfo);
    const restaurantId = localStorage.getItem('restaurantId');    // Initialize notification service
    useEffect(() => {
        if (!restaurantId) {
            return;
        }

        const notificationService = initializeNotifications({
            onMessage: (notification) => {
                if (notification.type === 'order') {
                    handleOrderNotification(notification);
                } else if (notification.type === 'transaction') {
                    handleTransactionNotification(notification);
                }
            },
            onError: (error) => {
                console.error('Notification error:', error);
                toast.error('Lost connection to notification service. Reconnecting...');
            }
        });

        notificationService.connect();

        return () => {
            closeNotifications();
        };
    }, [restaurantId]);

    const handleOrderNotification = (notification) => {
        const newNotification = {
            id: notification.orderId || Date.now(),
            type: 'order',
            message: `New order #${notification.orderId} received`,
            timestamp: new Date(),
            data: notification
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications
        toast.info(newNotification.message, {
            onClick: () => navigate(`/dashboard/orders/${notification.orderId}`)
        });
    };

    const handleTransactionNotification = (notification) => {
        const newNotification = {
            id: notification.transactionId || Date.now(),
            type: 'transaction',
            message: `New transaction of $${notification.amount} ${notification.type}`,
            timestamp: new Date(),
            data: notification
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
        toast.info(newNotification.message, {
            onClick: () => navigate('/dashboard/banking')
        });
    };

    const handleNotificationClick = (notification) => {
        if (notification.type === 'order') {
            navigate(`/dashboard/orders/${notification.data.orderId}`);
        } else if (notification.type === 'transaction') {
            navigate('/dashboard/banking');
        }
        setShowNotifications(false);
    };

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
            <div className="nav-right">                
                <div className="notification-container">
                    <button className="notification-btn" onClick={toggleNotifications}>
                        <FontAwesomeIcon icon={faBell} />
                        {notifications.length > 0 && (
                            <span className="notification-badge">{notifications.length}</span>
                        )}
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
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`notification-item ${notification.type}`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="notification-content">
                                                <div className="notification-message">{notification.message}</div>
                                                <div className="notification-time">
                                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-notifications">
                                        No notifications yet
                                    </div>
                                )}
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