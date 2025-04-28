import React from 'react';
import DashboardCard from './DashboardCard';
import Charts from './Charts';
import OrderHistory from './OrderHistory';
import './styles/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">FoodDash Overview</h1>
            
            {/* Stats Cards Section */}
            <div className="dashboard-cards">
                <DashboardCard title="Completed Order" value="60,554" />
                <DashboardCard title="Order Received" value="60,654" />
                <DashboardCard title="Ratings" value="4.5" />
                <DashboardCard title="Net Earning" value="$10,075" isHighlighted />
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-content">
                <div className="chart-column">
                    <Charts />
                </div>
                <div className="table-column">
                    <OrderHistory />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;