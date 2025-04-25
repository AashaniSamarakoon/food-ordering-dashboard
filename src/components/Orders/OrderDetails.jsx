import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DriverMap from './DriverMap';
import './styles/OrderDetails.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone} from "@fortawesome/free-solid-svg-icons";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // Sample order data - in real app this would come from API
    const order = {
        id: orderId,
        customer: 'John Doe',
        contact: '+1 (555) 123-4567',
        items: [
            { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
            { name: 'Garlic Bread', quantity: 1, price: 4.99 },
            { name: 'Coke', quantity: 1, price: 2.99 }
        ],
        subtotal: 33.96,
        tax: 2.71,
        deliveryFee: 3.99,
        total: 40.66,
        status: 'onTheWay',
        orderTime: '2023-06-15T10:30:00',
        pickupTime: '2023-06-15T10:45:00',
        deliveryType: 'delivery',
        deliveryAddress: '123 Main St, Anytown, USA',
        driver: {
            name: 'Michael Johnson',
            contact: '+1 (555) 987-6543',
            vehicle: 'Toyota Camry (ABC-1234)'
        },
        eta: undefined
    };

    function handleCallDriver() {

    }

    return (
        <div className="order-details">
            <div className="order-header">
                <div className="order-title">
                    <h2>Order #{order.id}</h2>
                    <span className={`status ${order.status}`}>
                    {order.status === 'onTheWay' ? 'On the Way' :
                        order.status === 'preparing' ? 'Preparing' : 'Completed'}
                </span>
                </div>
                <button className="back-button" onClick={() => navigate('/dashboard/orders')}>
                    ← Back to Orders
                </button>
            </div>

            <div className="order-grid">
                <div className="customer-info">
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> {order.customer}</p>
                    <p><strong>Contact:</strong> {order.contact}</p>
                    {order.deliveryType === 'delivery' && (
                        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                    )}
                </div>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="items-list">
                        {order.items.map((item, index) => (
                            <div key={index} className="item">
                                <span>{item.quantity}x {item.name}</span>
                                <span>${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="totals">
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        {/*<div className="total-row">*/}
                        {/*    <span>Tax</span>*/}
                        {/*    <span>${order.tax.toFixed(2)}</span>*/}
                        {/*</div>*/}
                        {/*{order.deliveryType === 'delivery' && (*/}
                        {/*    // <div className="total-row">*/}
                        {/*    //     <span>Delivery Fee</span>*/}
                        {/*    //     <span>${order.deliveryFee.toFixed(2)}</span>*/}
                        {/*    // </div>*/}
                        {/*)}*/}
                        <div className="total-row grand-total">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>


                {order.deliveryType === 'delivery' && order.status === 'onTheWay' && (
                    <div className="driver-tracking">
                        <h3>Driver Tracking</h3>
                        <div className="driver-info">
                            <p><strong>Driver:</strong> {order.driver?.name || 'Not assigned'}</p>
                            <p><strong>ETA:</strong> {order.eta || 'Calculating...'}</p>
                            {order.driver?.contact && (
                                <div className="driver-contact">
                                    <button onClick={handleCallDriver} className="call-button">
                                        <FontAwesomeIcon icon={faPhone} /> Call Driver
                                    </button>
                                </div>
                            )}
                        </div>
                        <DriverMap driver={order.driver} />
                    </div>
                )}

                {order.deliveryType === 'pickup' && (
                    <div className="pickup-info">
                        <h3>Pickup Information</h3>
                        <p><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleString()}</p>
                        <p><strong>Status:</strong> Ready for pickup</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;