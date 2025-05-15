// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { login } from './authSlice';
// import './styles/auth.css';
//
// const Login = () => {
//     const [credentials, setCredentials] = useState({
//         email: '',
//         password: ''
//     });
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsLoading(true);
//
//         try {
//             await dispatch(login(credentials)).unwrap();
//
//             // Redirect to dashboard or previous location
//             const from = location.state?.from?.pathname || '/dashboard';
//             navigate(from, { replace: true });
//
//         } catch (error) {
//             setError(error.message || 'Login failed. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     return (
//         <div className="auth-form">
//             <h2>Restaurant Login</h2>
//             {error && <div className="error-message">{error}</div>}
//
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={credentials.email}
//                     onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={credentials.password}
//                     onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="submit-btn"
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Logging in...' : 'Login'}
//                 </button>
//             </form>
//
//             <p className="auth-footer">
//                 Don't have an account?
//                 <span
//                     className="auth-link"
//                     onClick={() => navigate('/register')}
//                 >
//                     Register
//                 </span>
//             </p>
//         </div>
//     );
// };
//
// export default Login;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './styles/auth.css';

// const Login = () => {
//     const [credentials, setCredentials] = useState({
//         email: 'admin@restaurant.com',
//         password: 'password123'
//     });
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsLoading(true);

//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         if (credentials.email === 'admin@restaurant.com' &&
//             credentials.password === 'password123') {
//             navigate('/dashboard');
//         } else {
//             setError('Invalid email or password');
//         }

//         setIsLoading(false);
//     };

//     return (
//         <div className="login-container">
//             <div className="login-form">
//                 <div className="login-header">
//                     <h2>Restaurant Login</h2>
//                     <p>Welcome back! Please enter your credentials</p>
//                 </div>

//                 {error && <div className="login-error">{error}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             id="email"
//                             type="email"
//                             placeholder="Enter your email"
//                             value={credentials.email}
//                             onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             id="password"
//                             type="password"
//                             placeholder="Enter your password"
//                             value={credentials.password}
//                             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="login-button"
//                         disabled={isLoading}
//                     >
//                         {isLoading ? (
//                             <span className="loading-spinner"></span>
//                         ) : 'Login'}
//                     </button>
//                 </form>

//                 <div className="login-footer">
//                     <p>Don't have an account? <a href="/register">Register</a></p>
//                     <a href="/forgot-password" className="forgot-password">Forgot password?</a>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';
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
      
      // Log the token before login (if any)
      const existingToken = localStorage.getItem('token');
      console.log('Existing token before login:', existingToken ? 'Present' : 'None');
      
      const resultAction = await dispatch(login(credentials));
      console.log('Login action result type:', resultAction.type);
      
      if (login.fulfilled.match(resultAction)) {
        console.log('Login successful, payload:', resultAction.payload);
        
        // Log the received token
        console.log('Token received:', resultAction.payload.token ? 'Present' : 'Missing');
        
        // Check if restaurant data was synced
        if (resultAction.payload.restaurantData) {
          console.log('Restaurant data synced with login:', resultAction.payload.restaurantData);
        } else {
          console.warn('No restaurant data received with login');
        }
        
        // Now navigate to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else if (login.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload?.message || 'Login failed';
        console.error('Login rejected:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred during login');
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