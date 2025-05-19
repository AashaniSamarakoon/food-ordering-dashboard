import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import './styles/OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const allOrders = await orderService.getAllOrders();
                // Sort orders by date (newest first) and take the latest 5
                const sortedOrders = allOrders
                    .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
                    .slice(0, 5);
                setOrders(sortedOrders);
            } catch (err) {
                console.error('Error fetching recent orders:', err);
                setError('Failed to load recent orders');
                toast.error('Could not load recent orders');
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);    const getStatusLabel = (status) => {
        switch(status) {
            case 'PLACED':
                return 'New Order';
            // case 'IN_PROGRESS':
            //     return 'In Progress';
            // case 'PREPARING':
            //     return 'Preparing';
            // case 'READY_FOR_PICKUP':
            //     return 'Ready for Pickup';
            // case 'ON_THE_WAY':
            //     return 'On the Way';
            // case 'DELIVERED':
            //     return 'Delivered';
            case 'COMPLETED':
                return 'Completed';
            default:
                return status?.replace(/_/g, ' ');
        }
    };

    const handleOrderClick = (orderId) => {
        navigate(`/dashboard/orders/${orderId}`);
    };

    if (loading) {
        return (
            <div className="order-history">
                <h3>Recent Orders</h3>
                <div className="loading-state">Loading recent orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history">
                <h3>Recent Orders</h3>
                <div className="error-state">{error}</div>
            </div>
        );
    }

    return (
        <div className="order-history">
            <h3>Recent Orders</h3>
            {orders.length === 0 ? (
                <div className="empty-state">No recent orders found</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr 
                                key={order.id}
                                onClick={() => handleOrderClick(order.id)}
                                className="order-row"
                            >
                                <td>#{order.orderNumber || order.id}</td>
                                <td>{new Date(order.orderTime).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </td>
                                <td>LKR {order.totalAmount?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;