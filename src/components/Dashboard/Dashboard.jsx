// import React from 'react';
// import DashboardCard from './DashboardCard';
// import Charts from './Charts';
// import './styles/Dashboard.css';

// const Dashboard = () => {
//     return (
//         <div className="dashboard-container">
//             <h1 className="dashboard-title">Statistical Overview</h1>
//             <div className="dashboard-cards">
//                 <DashboardCard title="Completed Order" value="60,554" />
//                 <DashboardCard title="Order Received" value="60,654" />
//                 <DashboardCard title="Net Earning" value="10,0750" isHighlighted />
//             </div>
//             <div className="charts-grid">
//                 <Charts />
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React from 'react';
import DashboardCard from './DashboardCard';
// import Charts from './Charts';
import './styles/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Statistical Overview</h1>
            
            <div className="dashboard-cards">
                <DashboardCard title="Completed Order" value="60,554" />
                <DashboardCard title="Order Received" value="60,654" />
                <DashboardCard title="Net Earning" value="10,0750" isHighlighted />
            </div>
            
            {/* <div className="charts-container">
                <h3>Order Trends (Last 7 Days)</h3>
                <div className="chart-row">
                    <Charts />
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;