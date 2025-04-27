import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerRestaurant } from './authSlice';
import './styles/auth.css';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        restaurantName: '',
        email: '',
        password: '',
        confirmPassword: '',
        ownerName: '',
        nic: '',
        role:'',
        phone: '',
        address: '',
        location: null,
        bankAccountOwner: '',
        bankName: '',
        branchName: '',
        accountNumber: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // HERE Maps Refs
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const platform = useRef(null);
    const geocoder = useRef(null);

    // Initialize HERE Maps
    useEffect(() => {
        if (step === 3 && mapContainer.current && !map.current) {
            platform.current = new window.H.service.Platform({
                apikey: 'auwF8x-OOfmvjZx2PbAzzNeN4mnaMfNXiYDmouemjpI'
            });

            const defaultLayers = platform.current.createDefaultLayers();

            map.current = new window.H.Map(
                mapContainer.current,
                defaultLayers.vector.normal.map,
                {
                    center: { lat: 6.9271, lng: 79.8612 },
                    zoom: 12,
                    pixelRatio: window.devicePixelRatio || 1
                }
            );

            new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map.current));
            window.H.ui.UI.createDefault(map.current, defaultLayers);
            geocoder.current = platform.current.getSearchService();
            marker.current = new window.H.map.Marker({ lat: 6.9271, lng: 79.8612 });
            map.current.addObject(marker.current);

            return () => {
                if (map.current) {
                    map.current.dispose();
                }
            };
        }
    }, [step]);

    const handleAddressSearch = () => {
        if (!formData.address || !geocoder.current) return;

        geocoder.current.geocode(
            { q: formData.address, in: 'countryCode:LKA' },
            (result) => {
                if (result.items.length > 0) {
                    const location = result.items[0].position;
                    const address = result.items[0].address.label;

                    setFormData(prev => ({
                        ...prev,
                        address,
                        location: { lat: location.lat, lng: location.lng }
                    }));

                    map.current.setCenter(location);
                    marker.current.setGeometry(location);
                }
            },
            (error) => {
                console.error('Geocoding error:', error);
                setError('Could not find the specified address');
            }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNext = (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!formData.restaurantName || !formData.email || !formData.password || !formData.confirmPassword) {
                setError("All fields are required");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords don't match!");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
        } else if (step === 2) {
            if (!formData.ownerName || !formData.nic || !formData.phone) {
                setError("All fields are required");
                return;
            }
        } else if (step === 3) {
            if (!formData.address || !formData.location) {
                setError("Please select a valid address from the map");
                return;
            }
        }

        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const registrationData = {
                ...formData,
                latitude: formData.location?.lat,
                longitude: formData.location?.lng
            };
            
            await dispatch(registerRestaurant(registrationData)).unwrap();
            
            navigate('/login', {
                state: {
                    success: 'Registration successful! Please wait for verification.'
                }
            });
        } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <div className="auth-form">
                <h2>Register Your Restaurant</h2>
                {error && <div className="error-message">{error}</div>}

                {/* Progress indicator */}
                <div className="progress-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
                    <div className={`step ${step >= 4 ? 'active' : ''}`}>4</div>
                </div>

                {/* Step 1: Restaurant Basic Info */}
                {step === 1 && (
                    <form onSubmit={handleNext}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="restaurantName"
                                placeholder="Restaurant Name"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn primary"
                            >
                                Save & Next
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Owner Information */}
                {step === 2 && (
                    <form onSubmit={handleNext}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="ownerName"
                                placeholder="Owner Name"
                                value={formData.ownerName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="nic"
                                placeholder="NIC Number"
                                value={formData.nic}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="role"
                                placeholder="User Role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="submit-btn secondary"
                                onClick={handlePrevious}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="submit-btn primary"
                            >
                                Save & Next
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Address Information */}
                {step === 3 && (
                    <form onSubmit={handleNext}>
                        <div className="form-group">
                            <div className="address-search">
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Restaurant Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="search-btn"
                                    onClick={handleAddressSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* HERE Map Container */}
                        <div ref={mapContainer} className="map-container" />

                        {formData.location && (
                            <div className="coordinates">
                                <p>Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)}</p>
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="submit-btn secondary"
                                onClick={handlePrevious}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="submit-btn primary"
                            >
                                Save & Next
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 4: Bank Details */}
                {step === 4 && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="bankAccountOwner"
                                placeholder="Account Holder Name"
                                value={formData.bankAccountOwner}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="bankName"
                                placeholder="Bank Name"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="branchName"
                                placeholder="Branch Name"
                                value={formData.branchName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="submit-btn secondary"
                                onClick={handlePrevious}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="submit-btn primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                )}

                <p className="auth-footer">
                    Already have an account?
                    <span
                        className="auth-link"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;