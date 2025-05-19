import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DriverMap from './DriverMap';
import orderService from '../../services/orderService';
import './styles/OrderDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faSpinner, faArrowLeft, faLocationDot, faUser, faReceipt } from "@fortawesome/free-solid-svg-icons";

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const orderData = await orderService.getOrderById(orderId);
                
                // Transform backend data to match our component needs
                const transformedOrder = {
                    ...orderData,
                    orderNumber: orderData.id,
                    customerName: orderData.customer || 'Not provided',
                    customerContact: orderData.contact || 'Not provided',
                    deliveryType: orderData.deliveryType || 'pickup',
                    deliveryAddress: orderData.address || 'Not provided',
                    status: orderData.status || 'PENDING',
                    total: parseFloat(orderData.total || 0),
                    items: orderData.items || [],
                    location: orderData.location || { lat: 6.9271, lng: 79.8612 }, // Default to Colombo
                    driver: orderData.driver || null,
                    restaurantLocation: orderData.restaurantLocation || { lat: 6.9271, lng: 79.8612 }, // Default to Colombo
                    eta: orderData.eta || null,
                    pickupTime: orderData.pickupTime || new Date().toISOString()
                };
                
                setOrder(transformedOrder);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to load order details. Please try again later.');
                toast.error('Could not load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleCallDriver = () => {
        if (order?.driver?.contact) {
            window.location.href = `tel:${order.driver.contact}`;
        } else {
            toast.warning('Driver contact information not available');
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrder(prev => ({ ...prev, status: newStatus }));
            toast.success('Order status updated successfully');
        } catch (err) {
            console.error('Error updating order status:', err);
            toast.error('Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleCompleteOrder = async (event) => {
        const checked = event.target.checked;
        if (checked) {
            try {
                setIsCompleting(true);
                await orderService.updateOrderStatus(orderId, 'COMPLETED');
                setOrder(prev => ({ ...prev, status: 'COMPLETED' }));
                toast.success('Order marked as completed');
            } catch (err) {
                console.error('Error completing order:', err);
                toast.error('Failed to complete order');
                event.target.checked = false;
            } finally {
                setIsCompleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="order-details loading">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading order details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-details error">
                <p>{error}</p>
                <button onClick={() => navigate('/dashboard/orders')} className="back-button">
                    ← Back to Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-details error">
                <p>Order not found</p>
                <button onClick={() => navigate('/dashboard/orders')} className="back-button">
                    ← Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="order-details">
            <div className="order-header">
                <div className="order-title">
                    <button className="back-button" onClick={() => navigate('/dashboard/orders')}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
                    </button>
                    <h2>Order #{order.orderNumber}</h2>
                    <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status === 'IN_PROGRESS' ? 'In Progress' :
                         order.status === 'PREPARING' ? 'Preparing' :
                         order.status === 'READY_FOR_PICKUP' ? 'Ready for Pickup' :
                         order.status === 'ON_THE_WAY' ? 'On the Way' :
                         order.status === 'DELIVERED' ? 'Delivered' : 'Completed'}
                    </span>
                </div>
                <div className="complete-order-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={order.status === 'COMPLETED'}
                            onChange={handleCompleteOrder}
                            disabled={isCompleting || order.status === 'COMPLETED'}
                        />
                        <span>{isCompleting ? 'Completing...' : 'Mark as Completed'}</span>
                    </label>
                </div>
            </div>

            <div className="order-content">
                <div className="info-card">
                    <div className="info-section">
                        <h3><FontAwesomeIcon icon={faUser} className="section-icon" /> Customer Details</h3>
                        <div className="detail-row">
                            <p><strong>Name:</strong> {order.customerName}</p>
                            <p><strong>Contact:</strong> {order.customerContact}</p>
                            {order.deliveryType === 'delivery' && (
                                <p><strong>Address:</strong> {order.deliveryAddress}</p>
                            )}
                        </div>

                        {order.deliveryType === 'delivery' && (
                            <>
                                <h3 className="mt-4">
                                    <FontAwesomeIcon icon={faLocationDot} className="section-icon" /> 
                                    Driver Information
                                </h3>
                                <div className="detail-row">
                                    <p><strong>Name:</strong> {order.driver?.name || 'Not assigned'}</p>
                                    <p><strong>Contact:</strong> {order.driver?.contact || 'Not available'}</p>
                                    {order.status === 'ON_THE_WAY' && order.driver?.eta && (
                                        <p><strong>ETA:</strong> {order.eta}</p>
                                    )}
                                    {order.driver && order.driver.contact && (
                                        <button onClick={handleCallDriver} className="call-button">
                                            <FontAwesomeIcon icon={faPhone} /> Call Driver
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        <h3 className="mt-4">
                            <FontAwesomeIcon icon={faReceipt} className="section-icon" /> 
                            Order Summary
                        </h3>
                        <div className="items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="item">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>LKR {(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="total-row">
                                <strong>Total</strong>
                                <strong>LKR {order.total.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {order.deliveryType === 'delivery' && (
                    <div className="info-card">
                        <h3>Live Tracking</h3>
                        <DriverMap 
                            driver={order.driver}
                            customerLocation={[order.location.lat, order.location.lng]}
                            restaurantLocation={[order.restaurantLocation.lat, order.restaurantLocation.lng]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;