import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AccountCard from './AccountCard';
import TransactionList from './TransactionList';
import AddAccountModal from './AddAccountModal';
import bankingService from '../../services/bankingService';
import transactionService from '../../services/transactionService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyncAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import './styles/BankingPage.css';

const BankingPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const fetchedAccounts = await bankingService.getAllAccounts();
            console.log("Fetched accounts:", fetchedAccounts);
            setAccounts(fetchedAccounts || []);
            
            // Also fetch recent transactions if you have that endpoint
            // const fetchedTransactions = await bankingService.getRecentTransactions();
            // setTransactions(fetchedTransactions || []);
            
        } catch (error) {
            console.error("Error fetching banking data:", error);
            setError("Failed to load banking information. Please try again later.");
            toast.error("Could not connect to banking service");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setIsLoadingTransactions(true);
            const restaurantId = localStorage.getItem('restaurantId');
            if (!restaurantId) {
                toast.error('Restaurant ID not found. Please make sure you are logged in.');
                return;
            }
            
            const fetchedTransactions = await transactionService.getRestaurantTransactions();
            console.log("Fetched transactions:", fetchedTransactions);
            setTransactions(fetchedTransactions || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            if (error.message === 'Restaurant ID not found') {
                toast.error('Please log in again to view transactions');
            } else {
                toast.error("Could not load transactions: " + error.message);
            }
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    const handleAddAccount = async (accountData) => {
        try {
            setIsLoading(true);
            
            const newAccount = await bankingService.createAccount(accountData);
            console.log("Account created:", newAccount);
            
            // Refresh accounts list
            await fetchAccounts();
            
            // Close modal and show success message
            setShowModal(false);
            toast.success("Bank account added successfully!");
        } catch (error) {
            console.error("Error creating account:", error);
            
            let errorMessage = "Failed to add bank account";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="banking-container">
            {/* Header with title and actions */}
            <div className="banking-header">
                <div className="banking-title">
                    <FontAwesomeIcon icon={faUniversity} className="banking-icon" />
                    <h2>Banking</h2>
                </div>
                
                <div className="banking-actions">
                    <button 
                        className="refresh-button" 
                        onClick={fetchAccounts} 
                        disabled={isLoading}
                        title="Refresh banking data"
                    >
                        <FontAwesomeIcon icon={faSyncAlt} spin={isLoading} />
                    </button>
                    
                    <button 
                        className="add-account-button" 
                        onClick={() => setShowModal(true)}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Account
                    </button>
                </div>
            </div>

            {/* Accounts section */}
            <div className="section-container">
                <div className="section-header">
                    <h3>Accounts</h3>
                </div>
                
                <div className="section-content">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading accounts...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p>{error}</p>
                            <button onClick={fetchAccounts}>Try Again</button>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="empty-container">
                            <div className="empty-illustration">
                                <FontAwesomeIcon icon={faUniversity} size="3x" />
                            </div>
                            <h4>No bank accounts found</h4>
                            <p>Add your first account to get started with banking management.</p>
                            <button className="add-first-button" onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Your First Account
                            </button>
                        </div>
                    ) : (
                        <div className="accounts-grid">
                            {accounts.map(account => (
                                <AccountCard 
                                    key={account.id} 
                                    account={account}
                                    onViewDetails={(id) => {
                                        toast.info(`Viewing account ${id} details`);
                                        // Implement view details functionality
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Recent transactions section */}
            <div className="section-container">
                <div className="section-header">
                    <div className="header-with-actions">
                        <h3>Recent Transactions</h3>
                    </div>
                </div>
                <div className="section-content">
                    <TransactionList 
                        transactions={transactions}
                        isLoading={isLoadingTransactions}
                        onTransactionsUpdate={fetchTransactions}
                    />
                </div>
            </div>
            
            {/* Add account modal */}
            {showModal && (
                <AddAccountModal 
                    onClose={() => setShowModal(false)}
                    onSave={handleAddAccount}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default BankingPage;