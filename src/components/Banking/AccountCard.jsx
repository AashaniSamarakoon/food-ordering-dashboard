import React from 'react';
import './styles/AccountCard.css';

const AccountCard = ({ account }) => {
    return (
        <div
            className="account-card"
            style={{ backgroundColor: account.color }}
        >
            <div className="account-header">
                <h3>{account.bankName}</h3>
                <span className="account-type">{account.accountType}</span>
            </div>
            <div className="account-details">
                <p className="account-number">{account.accountNumber}</p>
                <p className="account-balance">
                    ${account.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
                </p>
            </div>
            <div className="account-actions">
                <button className="view-btn">View Details</button>
            </div>
        </div>
    );
};

export default AccountCard;