import React from 'react';
import './styles/OrdersPage.css';

const OrderList = ({ orders, onOrderClick }) => {    const getStatusInfo = (status) => {
        switch(status) {
            case 'PLACED':
                return { text: 'New Order', color: '#673AB7' }; // Purple for new orders
            case 'IN_PROGRESS':
                return { text: 'In Progress', color: '#9E9E9E' };
            case 'PREPARING':
                return { text: 'Preparing', color: '#FF9800' };
            case 'READY_FOR_PICKUP':
                return { text: 'Ready for Pickup', color: '#2196F3' };
            case 'ON_THE_WAY':
                return { text: 'On the Way', color: '#2196F3' };
            case 'DELIVERED':
                return { text: 'Delivered', color: '#4CAF50' };
            case 'COMPLETED':
                return { text: 'Completed', color: '#4CAF50' };
            default:
                return { text: status?.replace(/_/g, ' '), color: '#9E9E9E' };
        }
    };

    return (
        <table className="order-list">
            <thead>            <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Type</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {orders.map(order => (
                <tr
                    key={order.id}
                    onClick={() => onOrderClick(order.id)}
                    className="order-row"
                >
                    <td>#{order.orderNumber || order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>LKR {order.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td>
                        <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusInfo(order.status).color }}
                        >
                            {getStatusInfo(order.status).text}
                        </span>
                    </td>
                    <td>
                        {order.deliveryType?.toUpperCase() === 'DELIVERY' ? 'Delivery' : 'Pickup'}
                    </td>
                    <td>{new Date(order.orderTime).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default OrderList;