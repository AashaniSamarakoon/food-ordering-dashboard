import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatusTabs from './OrderStatusTabs';
import OrderList from './OrderList';
import './styles/OrdersPage.css';

const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState('inProgress');
    const navigate = useNavigate();

    // Sample order data
    const orders = {
        inProgress: [
            {
                id: 'ORD-1',
                customer: 'Aashani',
                items: 3,
                total: 4780.00,
                status: 'onTheWay',
                time: '10:30 AM',
                deliveryType: 'pickup'
            },
            {
                id: 'ORD-2',
                customer: 'Dulanjana',
                items: 2,
                total: 2300.00,
                status: 'onTheWay',
                time: '11:45 AM',
                deliveryType: 'delivery',
                driver: 'Michael Johnson'
            }
        ],
        completed: [
            {
                id: 'ORD-0999',
                customer: 'Alex Brown',
                items: 5,
                total: 65.25,
                status: 'completed',
                time: 'Yesterday, 2:15 PM',
                deliveryType: 'delivery',
                driver: 'Sarah Williams'
            }
        ]
    };

    const handleOrderClick = (orderId) => {
        navigate(`/dashboard/orders/${orderId}`);
    };

    return (
        <div className="orders-page">
            <div className="page-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')} // Link to your dashboard
                >
                    ← Back to Dashboard
                </button>
                {/*<h1>Order Management</h1>*/}
            </div>

            <OrderStatusTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={{
                    inProgress: orders.inProgress.length,
                    completed: orders.completed.length
                }}
            />

            <div className="orders-container">
                <OrderList
                    orders={orders[activeTab]}
                    onOrderClick={handleOrderClick}
                />
            </div>
        </div>
    );
};

export default OrdersPage;