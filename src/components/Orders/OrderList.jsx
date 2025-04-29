import React from 'react';
import './styles/OrdersPage.css';

const OrderList = ({ orders, onOrderClick }) => {
    const getStatusInfo = (status) => {
        switch(status) {
            case 'preparing':
                return { text: 'Preparing', color: '#FF9800' };
            case 'onTheWay':
                return { text: 'On the Way', color: '#2196F3' };
            case 'completed':
                return { text: 'Completed', color: '#4CAF50' };
            default:
                return { text: 'Pending', color: '#9E9E9E' };
        }
    };

    return (
        <table className="order-list">
            <thead>
            <tr>
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
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td>LKR {order.total.toFixed(2)}</td>
                    <td>
              <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusInfo(order.status).color }}
              >
                {getStatusInfo(order.status).text}
              </span>
                    </td>
                    <td>
                        {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </td>
                    <td>{order.time}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default OrderList;