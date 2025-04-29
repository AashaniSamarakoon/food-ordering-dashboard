import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Charts = () => {
    const orderData = {
        labels: ['Completed', 'Processing', 'Cancelled'],
        datasets: [{
            data: [48554, 10000, 2000],
            backgroundColor: [
                '#e7ac59',
                '#38904b',
                '#F44336'
            ],
            borderWidth: 0
        }]
    };

    return (
        <div className="chart-card">
            <h3>Order Status</h3>
            <div className="chart-wrapper">
                <Pie 
                    data={orderData} 
                    options={{ 
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { 
                                position: 'right',
                                labels: {
                                    boxWidth: 15,
                                    padding: 15
                                }
                            }
                        },
                        // These settings increase the visible radius
                        circumference: 360,  // Full circle
                        rotation: 0,         // Start at top
                        radius: '90%',       // Use maximum available space
                    }} 
                />
            </div>
        </div>
    );
};


export default Charts;