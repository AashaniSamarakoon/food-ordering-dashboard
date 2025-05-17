import React from 'react';
import './styles/TransactionList.css';

const TransactionList = ({ transactions, isLoading }) => {
  if (isLoading) {
    return <div className="loading-state">Loading transactions...</div>;
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-transaction-list">
        <p>No recent transactions found.</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Account</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>{transaction.account}</td>
              <td className={transaction.amount > 0 ? 'positive' : 'negative'}>
                {transaction.amount > 0 ? '+' : ''}
                LKR {transaction.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;