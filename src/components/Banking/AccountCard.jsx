import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMoneyBillWave, 
    faPiggyBank, 
    faCreditCard,
    faEye,
    faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import './styles/AccountCard.css';

const AccountCard = ({ account, onViewDetails }) => {
    // Map account types to icons and colors
    const getAccountTypeDetails = (type) => {
        switch(type) {            case 'CHECKING':
                return { 
                    icon: faMoneyBillWave, 
                    color: '#c1914d',
                    gradient: 'linear-gradient(135deg, #c1914d 0%, #d4a762 100%)',
                    displayName: 'Checking'
                };            case 'SAVINGS':
                return { 
                    icon: faPiggyBank, 
                    color: '#c1914d',
                    gradient: 'linear-gradient(135deg, #c1914d 0%, #d4a762 100%)',
                    displayName: 'Savings'
                };            case 'MERCHANT_SERVICES':
                return { 
                    icon: faCreditCard, 
                    color: '#4299E1',
                    gradient: 'linear-gradient(135deg, #4299E1 0%, #63B3ED 100%)',
                    displayName: 'Merchant Services'
                };
            default:
                return { 
                    icon: faMoneyBillWave,                    color: '#4299E1',
                    gradient: 'linear-gradient(135deg, #4299E1 0%, #63B3ED 100%)',
                    displayName: type
                };
        }
    };

    const typeDetails = getAccountTypeDetails(account.accountType);
    
    // Format money with commas and decimals
    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    
    return (
        <div 
            className="account-card"
            style={{ background: typeDetails.gradient }}
        >
            <div className="card-chip"></div>
            <div className="card-waves"></div>
            
            <div className="account-info">
                <div className="account-name">
                    <FontAwesomeIcon icon={typeDetails.icon} />
                    <h4>{account.bankName}</h4>
                </div>
                
                <div className="account-type">
                    {account.accountTypeDisplay || typeDetails.displayName}
                </div>
            </div>
            
            <div className="account-number">
                {account.maskedAccountNumber || '****' + account.accountNumber.substr(-4)}
            </div>
            
            <div className="account-balance-section">
                <div className="balance-label">Available Balance</div>
                <div className="balance-amount">LKR {formatCurrency(account.balance)}</div>
            </div>
            
            <div className="account-actions">
                <button 
                    className="view-details-btn"
                    onClick={() => onViewDetails(account.id)}
                >
                    <FontAwesomeIcon icon={faEye} /> Details
                </button>
                
                <button className="transfer-btn">
                    <FontAwesomeIcon icon={faExchangeAlt} /> Transfer
                </button>
            </div>
        </div>
    );
};

export default AccountCard;