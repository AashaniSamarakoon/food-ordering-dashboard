import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import './styles/auth.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
      
        try {
            console.log('Submitting login with email:', credentials.email);
            
            // Direct axios call without using the api service
            const response = await axios({
                method: 'POST',
                url: 'http://localhost:8082/api/auth/authenticate',
                data: credentials,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Important: Set withCredentials to false for authentication
                withCredentials: false
            });
            
            console.log('Login response:', response);
            
            if (response.data && response.data.token) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                
                // Update Redux state manually
                dispatch({
                    type: 'auth/login/fulfilled',
                    payload: response.data
                });
                
                // Try to sync restaurant data
                try {
                    const syncResponse = await axios({
                        method: 'GET',
                        url: 'http://localhost:8081/api/restaurants/sync',
                        headers: {
                            'Authorization': `Bearer ${response.data.token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        withCredentials: false
                    });
                    
                    console.log('Restaurant sync successful:', syncResponse.data);
                    
                    // Add restaurant data to the state
                    dispatch({
                        type: 'auth/syncRestaurantData/fulfilled',
                        payload: syncResponse.data
                    });
                } catch (syncError) {
                    console.warn('Restaurant sync failed:', syncError.message);
                }
                
                // Navigate to dashboard
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            
            let errorMessage = 'Authentication failed';
            if (err.response) {
                console.error('Error status:', err.response.status);
                console.error('Error data:', err.response.data);
                
                // Extract error message if available
                if (err.response.data && typeof err.response.data === 'object') {
                    errorMessage = err.response.data.message || errorMessage;
                }
                
                // Special case for 403 errors
                if (err.response.status === 403) {
                    errorMessage = 'Access denied. Please check your credentials.';
                }
            } else if (err.request) {
                errorMessage = 'No response from server. Please try again later.';
            } else {
                errorMessage = err.message || 'An error occurred during login';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-header">
                    <h2>Restaurant Login</h2>
                    <p>Welcome back! Please enter your credentials</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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
                        ) : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="/register">Register</a></p>
                    <a href="/check-status" className="forgot-password">Check account status</a>
                </div>
            </div>
        </div>
    );
};

export default Login;