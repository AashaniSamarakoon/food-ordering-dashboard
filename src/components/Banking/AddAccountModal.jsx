import React, { useState } from 'react';
import './styles/BankingPage.css';

const AddAccountModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'Checking'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add New Bank Account</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Bank Name*</label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Account Number*</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Routing Number*</label>
                        <input
                            type="text"
                            name="routingNumber"
                            value={formData.routingNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Account Type*</label>
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            required
                        >
                            <option value="Checking">Checking</option>
                            <option value="Savings">Savings</option>
                            <option value="Merchant">Merchant Services</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccountModal;