// src/components/Dashboard/Charts.jsx
import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Charts = () => {
  // Order trends data (last 7 days)
  const orderData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Completed Orders',
        data: [8500, 8200, 8800, 8700, 9200, 9500, 8900],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Received Orders',
        data: [8600, 8300, 8900, 8800, 9300, 9600, 9000],
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

//   // Earnings data by category
//   const earningsData = {
//     labels: ['Food', 'Beverages', 'Desserts', 'Others'],
//     datasets: [
//       {
//         label: 'Earnings ($)',
//         data: [45000, 25000, 15000, 15750],
//         backgroundColor: [
//           '#FF6384',
//           '#36A2EB',
//           '#FFCE56',
//           '#4BC0C0'
//         ],
//         borderWidth: 1
//       }
//     ]
//   };

//   // Customer demographics
//   const customerData = {
//     labels: ['New Customers', 'Returning Customers', 'VIP Customers'],
//     datasets: [
//       {
//         data: [30000, 25000, 5554],
//         backgroundColor: [
//           '#FF9F40',
//           '#9966FF',
//           '#00CC99'
//         ],
//         hoverBackgroundColor: [
//           '#FFB74D',
//           '#A188FF',
//           '#26A69A'
//         ]
//       }
//     ]
//   };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Order Trends (Last 7 Days)</h3>
        <Line 
          data={orderData} 
          options={{ 
            responsive: true,
            plugins: {
              legend: { position: 'top' }
            }
          }} 
        />
      </div>
      
      {/* <div className="chart-row">
        <div className="chart-card">
          <h3>Earnings by Category</h3>
          <Bar 
            data={earningsData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }} 
          />
        </div> */}
        
        {/* <div className="chart-card">
          <h3>Customer Demographics</h3>
          <Pie 
            data={customerData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { position: 'right' }
              }
            }} 
          />
        </div> */}

      
    </div>
  );
};

export default Charts;