import React from 'react';
import './styles/TransactionList.css';

const TransactionList = ({ transactions }) => {
    return (
        <div className="transaction-list">
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Account</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.description}</td>
                        <td className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                            {transaction.amount >= 0 ? '+' : ''}
                            ${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td>{transaction.account}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;