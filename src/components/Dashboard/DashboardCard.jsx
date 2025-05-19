import React, { useState, useEffect } from 'react';
import './styles/DashboardCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faShoppingBag,
    faDollarSign,
    faStar,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import orderService from '../../services/orderService';

const DashboardCard = ({ title, value: initialValue, isHighlighted = false }) => {
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(false);    const iconMap = {
        'Completed Orders': faCheckCircle,
        'Order Received': faShoppingBag,
        'Net Earning': faDollarSign,
        'Ratings': faStar
    };

    useEffect(() => {
        const fetchOrderStats = async () => {            if (title !== 'Completed Orders' && title !== 'Order Received') return;
            
            try {
                setLoading(true);
                const orders = await orderService.getAllOrders();                if (title === 'Completed Orders') {
                    // Only count orders that are in the Completed state
                    const completedOrders = orders.filter(order => 
                        order.status === 'COMPLETED' && 
                        new Date(order.orderTime) <= new Date()
                    );
                    setValue(completedOrders.length);
                } else if (title === 'Order Received') {
                    const totalOrders = orders.filter(
                        order => order.status === 'COMPLETED' || 
                               order.status === 'PLACED' || 
                               order.status === 'IN_PROGRESS'
                    ).length;
                    setValue(totalOrders);
                }
            } catch (err) {
                console.error('Error fetching order statistics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStats();
        // Refresh stats every minute
        const interval = setInterval(fetchOrderStats, 60000);
        return () => clearInterval(interval);
    }, [title]);

    return (
        <div className={`dashboard-card ${isHighlighted ? 'highlighted' : ''}`}>
            <div className="card-icon-container">
                <FontAwesomeIcon icon={iconMap[title]} className="card-icon" />
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                {loading ? (
                    <div className="loading-value">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : title === 'Ratings' ? (
                    <div className="rating-value">
                        <span className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon 
                                    key={i} 
                                    icon={faStar} 
                                    className={`star ${i < Math.floor(parseFloat(value)) ? 'filled' : ''}`}
                                />
                            ))}
                        </span>
                        <span className="numeric-value">{value}</span>
                    </div>
                ) : (
                    <p className="card-value">{value}</p>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;