import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import orderService from '../../services/orderService';
import { toast } from 'react-toastify';
import './styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Charts = () => {
    const [orderStats, setOrderStats] = useState({
        placed: 0,
        inProgress: 0,
        preparing: 0,
        readyForPickup: 0,
        onTheWay: 0,
        delivered: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderStats = async () => {
            try {
                const orders = await orderService.getAllOrders();
                
                // Calculate stats from orders
                const stats = orders.reduce((acc, order) => {
                    switch(order.status) {
                        case 'PLACED':
                            acc.placed++;
                            break;
                        case 'IN_PROGRESS':
                            acc.inProgress++;
                            break;
                        case 'PREPARING':
                            acc.preparing++;
                            break;
                        case 'READY_FOR_PICKUP':
                            acc.readyForPickup++;
                            break;
                        case 'ON_THE_WAY':
                            acc.onTheWay++;
                            break;
                        case 'DELIVERED':
                            acc.delivered++;
                            break;
                        case 'COMPLETED':
                            acc.completed++;
                            break;
                        default:
                            break;
                    }
                    return acc;
                }, {
                    placed: 0,
                    inProgress: 0,
                    preparing: 0,
                    readyForPickup: 0,
                    onTheWay: 0,
                    delivered: 0,
                    completed: 0
                });

                setOrderStats(stats);
            } catch (err) {
                console.error('Error fetching order stats:', err);
                toast.error('Could not load order statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStats();
        // Refresh stats every minute
        const interval = setInterval(fetchOrderStats, 60000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: [
            'New Orders',
            // 'In Progress',
            // 'Preparing',
            // 'Ready for Pickup',
            // 'On the Way',
            // 'Delivered',
            'Completed'
        ],
        datasets: [
            {
                data: [
                    orderStats.placed,
                    // orderStats.inProgress,
                    // orderStats.preparing,
                    // orderStats.readyForPickup,
                    // orderStats.onTheWay,
                    // orderStats.delivered,
                    orderStats.completed
                ],
                backgroundColor: [
                    '#d28d38',  // Purple for new orders
                    // '#9E9E9E',  // Grey for in progress
                    // '#FF9800',  // Orange for preparing
                    // '#2196F3',  // Blue for ready
                    // '#03A9F4',  // Light Blue for on the way
                    // '#4CAF50',  // Green for delivered
                    '#3c7e3e',  // Dark Green for completed
                ],
                borderWidth: 0
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        circumference: 360,  // Full circle
        rotation: -90,       // Start at top
        radius: '90%'       // Use maximum available space
    };

    return (
        <div className="chart-card">
            <h3>Order Distribution</h3>
            {loading ? (
                <div className="chart-loading">Loading statistics...</div>
            ) : (
                <div className="chart-wrapper">
                    <Pie data={chartData} options={options} />
                </div>
            )}
        </div>
    );
};

export default Charts;