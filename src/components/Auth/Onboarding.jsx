// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import './styles/auth.css';

// export default function Onboarding() {
//     const navigate = useNavigate();
//     const [currentFeature, setCurrentFeature] = useState(0);
//     const [isAnimating, setIsAnimating] = useState(false);

//     const features = [
//         {
//             icon: '🍽️',
//             title: 'Menu Management',
//             description: 'Update your menu items with ease and keep your offerings fresh'
//         },
//         {
//             icon: '📦',
//             title: 'Order Tracking',
//             description: 'Monitor orders in real-time with our intuitive dashboard'
//         },
//         {
//             icon: '📊',
//             title: 'Sales Analytics',
//             description: 'Gain valuable insights into your business performance'
//         }
//     ];

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setIsAnimating(true);
//             setTimeout(() => {
//                 setCurrentFeature((prev) => (prev + 1) % features.length);
//                 setIsAnimating(false);
//             }, 300); // Animation duration
//         }, 2500); // Change every 3.5 seconds

//         return () => clearInterval(interval);
//     }, [features.length]);

//     const handleRegisterClick = () => navigate('/register');
//     const handleLoginClick = () => navigate('/login');

//     return (
//         <div className="onboarding-screen">
//             <div className="onboarding-content">
//                 <div className="onboarding-header">
//                     <h1>Welcome to Quick Serve</h1>
//                     <p className="subtitle">Get More Orders and Be a Part of Us</p>
//                 </div>

//                 <div className="features-carousel">
//                     <div className={`feature-card ${isAnimating ? 'slide-out' : 'slide-in'}`}>
//                         <div className="feature-icon-container">
//                             <span className="feature-icon">{features[currentFeature].icon}</span>
//                         </div>
//                         <h3>{features[currentFeature].title}</h3>
//                         <p>{features[currentFeature].description}</p>
//                     </div>
//                 </div>

//                 <div className="onboarding-cta">
//                     <button
//                         className="cta-button primary"
//                         onClick={handleRegisterClick}
//                         aria-label="Register your restaurant"
//                     >
//                         Register Your Restaurant
//                     </button>
//                     <button
//                         className="cta-button secondary"
//                         onClick={handleLoginClick}
//                         aria-label="Login as existing user"
//                     >
//                         Existing User? Login
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }



import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/auth.css';
import logo from './logo.png'; // Adjust the path to your logo

export default function Onboarding() {
    const navigate = useNavigate();
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const features = [
        {
            icon: '🍽️',
            title: 'Menu Management',
            description: 'Update your menu items with ease and keep your offerings fresh'
        },
        {
            icon: '📦',
            title: 'Order Tracking',
            description: 'Monitor orders in real-time with our intuitive dashboard'
        },
        {
            icon: '📊',
            title: 'Sales Analytics',
            description: 'Gain valuable insights into your business performance'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentFeature((prev) => (prev + 1) % features.length);
                setIsAnimating(false);
            }, 300);
        }, 2500);

        return () => clearInterval(interval);
    }, [features.length]);

    const handleRegisterClick = () => navigate('/register');
    const handleLoginClick = () => navigate('/login');

    return (
        <div className="onboarding-screen">
            <div className="onboarding-content">
                <div className="logo-container">
                    <img src={logo} alt="Savory Bites Logo" className="logo" />
                </div>
                
                <div className="onboarding-header">
                    <h1>Welcome to Quick Serve</h1>
                    <p className="subtitle">Get More Orders and Be a Part of Us</p>
                </div>

                <div className="features-carousel">
                    <div className={`feature-card ${isAnimating ? 'slide-out' : 'slide-in'}`}>
                        <div className="feature-icon-container">
                            <span className="feature-icon">{features[currentFeature].icon}</span>
                        </div>
                        <h3>{features[currentFeature].title}</h3>
                        <p>{features[currentFeature].description}</p>
                    </div>
                </div>

                <div className="onboarding-cta">
                    <button
                        className="cta-button primary"
                        onClick={handleRegisterClick}
                        aria-label="Register your restaurant"
                    >
                        Get Started
                    </button>
                    <button
                        className="cta-button secondary"
                        onClick={handleLoginClick}
                        aria-label="Login as existing user"
                    >
                        Existing User? Login
                    </button>
                </div>
            </div>
        </div>
    );
}