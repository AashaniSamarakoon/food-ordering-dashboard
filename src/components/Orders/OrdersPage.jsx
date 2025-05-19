import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrderStatusTabs from './OrderStatusTabs';
import OrderList from './OrderList';
import orderService from '../../services/orderService';
import './styles/OrdersPage.css';

const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState('inProgress');
    const [orders, setOrders] = useState({ inProgress: [], completed: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setError(null);
            const allOrders = await orderService.getAllOrders();
            console.log('Fetched orders:', allOrders);

            // Group orders by their status
            const inProgressStatuses = ['PLACED', 'IN_PROGRESS', 'PREPARING', 'READY_FOR_PICKUP', 'ON_THE_WAY'];
            const completedStatuses = ['COMPLETED', 'DELIVERED'];

            const grouped = {
                inProgress: allOrders.filter(order => inProgressStatuses.includes(order.status)) || [],
                completed: allOrders.filter(order => completedStatuses.includes(order.status)) || []
            };

            console.log('Grouped orders:', grouped);
            setOrders(grouped);
        } catch (err) {
            console.error('Error fetching orders:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load orders. Please try again later.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Load orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Refresh orders every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleOrderClick = (orderId) => {
        navigate(`/dashboard/orders/${orderId}`);
    };

    return (
        <div className="orders-page">            <div className="page-header">
                <div className="header-left">
                    <button
                        className="back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Back to Dashboard
                    </button>
                    <h1>Orders</h1>
                </div>
            </div>

            <OrderStatusTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={{
                    inProgress: orders.inProgress?.length || 0,
                    completed: orders.completed?.length || 0
                }}
            />

            <div className="orders-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading orders...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={fetchOrders} className="retry-button">
                            Retry
                        </button>
                    </div>
                ) : Array.isArray(orders[activeTab]) && orders[activeTab].length === 0 ? (
                    <div className="empty-state">
                        <p>No {activeTab === 'inProgress' ? 'active' : 'completed'} orders found</p>
                        {activeTab === 'inProgress' && (
                            <p className="empty-state-subtitle">New orders will appear here automatically</p>
                        )}
                    </div>
                ) : (
                    <OrderList
                        orders={orders[activeTab] || []}
                        onOrderClick={handleOrderClick}
                    />
                )}
            </div>
        </div>
    );
};

export default OrdersPage;