import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import './styles/auth.css';

const CheckStatus = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Initialize email from location state if available
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setStatus(null);

        try {
            console.log('Checking status for email:', email);
            const response = await api.get(`/auth/status?email=${encodeURIComponent(email)}`);
            console.log('Status response:', response.data);
            setStatus(response.data);
        } catch (err) {
            console.error('Status check error:', err);
            setError(
                err.response?.data?.message || 
                'Could not check account status. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-header">
                    <h2>Account Status</h2>
                    <p>Check your restaurant account verification status</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                {!status ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : 'Check Status'}
                        </button>
                    </form>
                ) : (
                    <div className="status-result">
                        <h3>{status.restaurantName}</h3>
                        <p><strong>Email:</strong> {status.email}</p>
                        <p>
                            <strong>Status:</strong> 
                            <span className={status.verified ? "status-verified" : "status-unverified"}>
                                {status.verified ? 'Verified' : 'Not Verified'}
                            </span>
                        </p>
                        <p className="status-message">
                            {status.verified 
                                ? 'Your account has been verified. You can now log in.' 
                                : 'Your account is pending verification. Please wait for admin approval.'}
                        </p>
                        
                        <div className="button-group">
                            <button
                                className="login-button"
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="login-footer">
                    <a href="/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default CheckStatus;