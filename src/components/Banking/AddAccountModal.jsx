import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faUniversity,
    faMoneyBillWave,
    faPiggyBank,
    faCreditCard,
    faCheck,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './styles/AddAccountModal.css';

const AddAccountModal = ({ onClose, onSave, isLoading }) => {
    const [step, setStep] = useState(1); // For multi-step form
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'CHECKING',
        initialBalance: '0.00'
    });
    
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    // Account type options
    const accountTypes = [
        { value: 'CHECKING', label: 'Checking Account', icon: faMoneyBillWave, description: 'For everyday transactions and business expenses' },
        { value: 'SAVINGS', label: 'Savings Account', icon: faPiggyBank, description: 'For storing reserves and earning interest' },
        { value: 'MERCHANT_SERVICES', label: 'Merchant Services', icon: faCreditCard, description: 'For payment processing and business transactions' }
    ];
    
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for account number (add spaces for readability)
        if (name === 'accountNumber') {
            // Remove non-numeric characters
            const cleaned = value.replace(/\D/g, '');
            // Format with spaces every 4 digits (but store without spaces)
            setFormData(prev => ({ 
                ...prev, 
                [name]: cleaned 
            }));
        } 
        // Special handling for initial balance (ensure valid currency format)
        else if (name === 'initialBalance') {
            // Allow only numbers and one decimal point
            const cleaned = value.replace(/[^\d.]/g, '');
            const decimalParts = cleaned.split('.');
            
            // Ensure only one decimal point and max 2 decimal places
            let formattedValue = cleaned;
            if (decimalParts.length > 1) {
                formattedValue = `${decimalParts[0]}.${decimalParts[1].substring(0, 2)}`;
            }
            
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Mark field as touched
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    // Validate form data
    const validateForm = () => {
        const newErrors = {};
        
        // Bank Name validation
        if (!formData.bankName.trim()) {
            newErrors.bankName = 'Bank name is required';
        }
        
        // Account Number validation
        if (!formData.accountNumber) {
            newErrors.accountNumber = 'Account number is required';
        } else if (formData.accountNumber.length < 8) {
            newErrors.accountNumber = 'Account number must be at least 8 digits';
        }
        
        // Routing Number validation
        if (!formData.routingNumber) {
            newErrors.routingNumber = 'Routing number is required';
        } else if (formData.routingNumber.length !== 9) {
            newErrors.routingNumber = 'Routing number must be 9 digits';
        }
        
        // Initial Balance validation (optional)
        if (formData.initialBalance && isNaN(parseFloat(formData.initialBalance))) {
            newErrors.initialBalance = 'Initial balance must be a valid number';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        if (validateForm()) {
            const submitData = {
                ...formData,
                // Convert string values to appropriate types
                initialBalance: formData.initialBalance ? parseFloat(formData.initialBalance) : 0
            };
            
            onSave(submitData);
        }
    };
    
    // Check if a field has an error and has been touched
    const hasError = (field) => Boolean(touched[field] && errors[field]);
    
    return (
        <div className="modal-overlay">
            <div className="account-modal">
                <div className="modal-header">
                    <div className="modal-title">
                        <FontAwesomeIcon icon={faUniversity} className="modal-icon" />
                        <h3>Add New Bank Account</h3>
                    </div>
                    <button className="close-button" onClick={onClose} disabled={isLoading}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="form-step">
                                <h4>Account Information</h4>
                                
                                {/* Bank Name */}
                                <div className={`form-group ${hasError('bankName') ? 'has-error' : ''}`}>
                                    <label htmlFor="bankName">Bank Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="bankName"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        placeholder="Enter the bank name"
                                        disabled={isLoading}
                                        className={hasError('bankName') ? 'error' : ''}
                                    />
                                    {hasError('bankName') && (
                                        <div className="error-message">
                                            <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.bankName}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Account Type (Radio Buttons with Icons) */}
                                <div className="form-group">
                                    <label>Account Type <span className="required">*</span></label>
                                    <div className="account-type-options">
                                        {accountTypes.map(type => (
                                            <div 
                                                className={`account-type-option ${formData.accountType === type.value ? 'selected' : ''}`}
                                                key={type.value}
                                                onClick={() => setFormData(prev => ({ ...prev, accountType: type.value }))}
                                            >
                                                <div className="type-icon">
                                                    <FontAwesomeIcon icon={type.icon} />
                                                </div>
                                                <div className="type-details">
                                                    <div className="type-name">{type.label}</div>
                                                    <div className="type-description">{type.description}</div>
                                                </div>
                                                <div className="type-checkbox">
                                                    {formData.accountType === type.value && (
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="step-actions">
                                    <button 
                                        type="button"
                                        className="next-button"
                                        onClick={() => setStep(2)}
                                        disabled={!formData.bankName || !formData.accountType}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {step === 2 && (
                            <div className="form-step">
                                <h4>Account Details</h4>
                                
                                {/* Account Number */}
                                <div className={`form-group ${hasError('accountNumber') ? 'has-error' : ''}`}>
                                    <label htmlFor="accountNumber">Account Number <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={formData.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                                        onChange={handleChange}
                                        placeholder="Enter account number"
                                        disabled={isLoading}
                                        className={hasError('accountNumber') ? 'error' : ''}
                                    />
                                    {hasError('accountNumber') ? (
                                        <div className="error-message">
                                            <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.accountNumber}
                                        </div>
                                    ) : (
                                        <div className="field-hint">
                                            Account number should be 8-17 digits long
                                        </div>
                                    )}
                                </div>
                                
                                {/* Routing Number */}
                                <div className={`form-group ${hasError('routingNumber') ? 'has-error' : ''}`}>
                                    <label htmlFor="routingNumber">Routing Number <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="routingNumber"
                                        name="routingNumber"
                                        value={formData.routingNumber}
                                        onChange={handleChange}
                                        placeholder="9-digit routing number"
                                        maxLength="9"
                                        disabled={isLoading}
                                        className={hasError('routingNumber') ? 'error' : ''}
                                    />
                                    {hasError('routingNumber') ? (
                                        <div className="error-message">
                                            <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.routingNumber}
                                        </div>
                                    ) : (
                                        <div className="field-hint">
                                            Routing number must be exactly 9 digits
                                        </div>
                                    )}
                                </div>
                                
                                {/* Initial Balance */}
                                <div className={`form-group ${hasError('initialBalance') ? 'has-error' : ''}`}>
                                    <label htmlFor="initialBalance">Initial Balance</label>
                                    <div className="currency-input">
                                        <span className="currency-symbol">LKR</span>
                                        <input
                                            type="text"
                                            id="initialBalance"
                                            name="initialBalance"
                                            value={formData.initialBalance}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            disabled={isLoading}
                                            className={hasError('initialBalance') ? 'error' : ''}
                                        />
                                    </div>
                                    {hasError('initialBalance') && (
                                        <div className="error-message">
                                            <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.initialBalance}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="step-actions">
                                    <button 
                                        type="button"
                                        className="back-button"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                    >
                                        Back
                                    </button>
                                    
                                    <button 
                                        type="submit"
                                        className="submit-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Adding Account...
                                            </>
                                        ) : (
                                            'Add Account'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAccountModal;