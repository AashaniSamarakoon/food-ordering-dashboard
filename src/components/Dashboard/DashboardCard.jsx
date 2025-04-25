import React from 'react';
import './styles/DashboardCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faShoppingBag,
    faDollarSign
} from '@fortawesome/free-solid-svg-icons';

const DashboardCard = ({ title, value, isHighlighted = false }) => {
    const iconMap = {
        'Completed Order': faCheckCircle,
        'Order Received': faShoppingBag,
        'Net Earning': faDollarSign
    };

    return (
        <div className={`dashboard-card ${isHighlighted ? 'highlighted' : ''}`}>
            <FontAwesomeIcon icon={iconMap[title]} size="2x" className="card-icon" />
            <h3 className="card-title">{title}</h3>
            <p className="card-value">{value}</p>
        </div>
    );
};

export default DashboardCard;