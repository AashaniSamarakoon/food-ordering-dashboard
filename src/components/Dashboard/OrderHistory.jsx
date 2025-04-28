import React from 'react';
import './styles/OrderHistory.css';

const OrderHistory = () => {
    const orderData = [
        { id: '#FD-1001', date: '05/27', status: 'Delivered', amount: '$25.50' },
        { id: '#FD-1002', date: '05/28', status: 'Processing', amount: '$18.75' },
        { id: '#FD-1003', date: '05/29', status: 'Cancelled', amount: '$12.00' },
        { id: '#FD-1004', date: '05/30', status: 'Delivered', amount: '$32.40' }
    ];

    return (
        <div className="order-history">
            <h3>Recent Orders</h3>
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
                    {orderData.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id}</td>
                            <td>{order.date}</td>
                            <td>
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>{order.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;