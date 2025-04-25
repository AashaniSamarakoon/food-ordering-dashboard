import React from 'react';

const OrderStatusTabs = ({ activeTab, onTabChange, counts }) => {
    return (
        <div className="status-tabs">
            <button
                className={`tab ${activeTab === 'inProgress' ? 'active' : ''}`}
                onClick={() => onTabChange('inProgress')}
            >
                In Progress ({counts.inProgress})
            </button>
            <button
                className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => onTabChange('completed')}
            >
                Completed ({counts.completed})
            </button>
        </div>
    );
};

export default OrderStatusTabs;