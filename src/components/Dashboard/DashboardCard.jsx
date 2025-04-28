import React from 'react';
import './styles/DashboardCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faShoppingBag,
    faDollarSign,
    faStar
} from '@fortawesome/free-solid-svg-icons';

const DashboardCard = ({ title, value, isHighlighted = false }) => {
    const iconMap = {
        'Completed Order': faCheckCircle,
        'Order Received': faShoppingBag,
        'Net Earning': faDollarSign,
        'Ratings': faStar
    };

    return (
        <div className={`dashboard-card ${isHighlighted ? 'highlighted' : ''}`}>
            <div className="card-icon-container">
                <FontAwesomeIcon icon={iconMap[title]} className="card-icon" />
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                {title === 'Ratings' ? (
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