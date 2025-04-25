import React, { useState } from 'react';
import AccountCard from './AccountCard';
import TransactionList from './TransactionList';
import AddAccountModal from './AddAccountModal';
import './styles/BankingPage.css';

const BankingPage = () => {
    const [accounts, setAccounts] = useState([
        {
            id: 1,
            bankName: 'Chase Bank',
            accountNumber: '****3456',
            accountType: 'Business Checking',
            balance: 12500.75,
            color: '#4a6bdf'
        },
        {
            id: 2,
            bankName: 'Bank of America',
            accountNumber: '****7821',
            accountType: 'Savings',
            balance: 32500.25,
            color: '#ff6b6b'
        }
    ]);

    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '2023-06-15',
            description: 'From APP',
            amount: -1250.50,
            account: 'Chase Bank'
        },
        {
            id: 2,
            date: '2023-06-14',
            description: 'From APP',
            amount: 3845.75,
            account: 'Chase Bank'
        }
    ]);

    const [showModal, setShowModal] = useState(false);

    const handleAddAccount = (newAccount) => {
        setAccounts([...accounts, {
            ...newAccount,
            id: accounts.length + 1,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }]);
        setShowModal(false);
    };

    return (
        <div className="banking-page">
            <div className="banking-header">
                <h2>Restaurant Banking</h2>
                <button
                    className="add-account-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Bank Account
                </button>
            </div>

            <div className="accounts-section">
                <h3>Bank Accounts</h3>
                <div className="accounts-grid">
                    {accounts.map(account => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            </div>

            <div className="transactions-section">
                <h3>Recent Transactions</h3>
                <TransactionList transactions={transactions} />
            </div>

            {showModal && (
                <AddAccountModal
                    onClose={() => setShowModal(false)}
                    onSave={handleAddAccount}
                />
            )}
        </div>
    );
};

export default BankingPage;