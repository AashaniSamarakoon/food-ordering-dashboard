import React from 'react';
import { useSelector } from 'react-redux';
import DashboardCard from './DashboardCard';
import Charts from './Charts';
import OrderHistory from './OrderHistory';
import './styles/Dashboard.css';

// Import your food images
import burgerImg from './images/burger.jpg';
import pizzaImg from './images/pizza.jpg';
import pastaImg from './images/pasta.jpg';
import sushiImg from './images/sushi.jpg';

const Dashboard = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const foodItems = [
        { img: burgerImg, name: 'Burger', color: '#E28445' },
        { img: pizzaImg, name: 'Pizza', color: '#F44336' },
        { img: pastaImg, name: 'Pasta', color: '#4CAF50' },
        { img: sushiImg, name: 'Sushi', color: '#2196F3' }
    ];

    return (
        <div className="dashboard-container">
            <div className="square-food-container">
                {foodItems.map((item, index) => (
                    <div key={index} className="square-food-item" style={{ borderColor: item.color }}>
                        <img 
                            src={item.img} 
                            alt={item.name} 
                            className="square-food-image"
                        />
                        <span className="square-food-label">{item.name}</span>
                    </div>
                ))}
            </div>

            <h1 className="dashboard-title">{userInfo?.restaurantName || 'Restaurant'} Overview</h1>

            <div className="dashboard-cards">
                <DashboardCard title="Completed Order" value="60,554" />
                <DashboardCard title="Order Received" value="60,654" />
                <DashboardCard title="Ratings" value="4.5" />
                <DashboardCard title="Net Earning" value="LKR 10,600.00" isHighlighted />
            </div>

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