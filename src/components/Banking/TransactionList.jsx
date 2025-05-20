import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import transactionService from '../../services/transactionService';
import { toast } from 'react-toastify';
import './styles/TransactionList.css';

const TransactionList = ({ transactions, isLoading, onTransactionsUpdate }) => {
  const handleSync = async () => {
    try {
      await transactionService.syncRestaurantTransactions();
      onTransactionsUpdate();
      // Trigger a notification through the WebSocket by using the notificationService
      toast.success("Transactions synchronized successfully");
    } catch (error) {
      toast.error(error.message || "Failed to sync transactions");
    }
  };

  if (isLoading) {
    return <div className="loading-state">Loading transactions...</div>;
  }

  return (
    <div className="transaction-list">
      <div className="transaction-header">
        <button 
          className="sync-button"
          onClick={handleSync}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faSync} spin={isLoading} />
          {isLoading ? 'Syncing...' : 'Sync Transactions'}
        </button>
      </div>

      {(!transactions || transactions.length === 0) ? (
        <div className="empty-transaction-list">
          <p>No recent transactions found.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Bank</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.bankName}</td>                <td className={transaction.amount >= 0 ? 'positive' : 'negative'}>
                  {transaction.amount >= 0 ? '+LKR ' : '-LKR '}
                  {Math.abs(transaction.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;