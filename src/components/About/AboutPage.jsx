import React from 'react';
import './styles/AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Savory Bites</h1>
                    <p className="tagline">Authentic flavors since 2010</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="about-content-wrapper">
                <div className="about-content">
                    <div className="two-column-section">
                        <div className="column">
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2010, Savory Bites began as a small family-owned restaurant with a passion for
                                bringing authentic flavors to our community. What started as a humble kitchen has grown
                                into a beloved dining destination, known for our commitment to quality ingredients and
                                traditional recipes with a modern twist.
                            </p>

                            {/* <h2>Our Services</h2>
                            <ul className="services-list">
                                <li>
                                    <strong>Dine-in Experience:</strong> Enjoy our cozy atmosphere with seating for 50 guests
                                </li>
                                <li>
                                    <strong>Takeout & Delivery:</strong> Available through our app and major delivery platforms
                                </li>
                            </ul> */}
                        </div>

                        <div className="column">
                            {/* <ul className="services-list continue">
                                <li>
                                    <strong>Catering:</strong> Full-service catering for events from 20 to 200 people
                                </li>
                                <li>
                                    <strong>Cooking Classes:</strong> Monthly classes with our head chef
                                </li>
                            </ul> */}

                            <div className="contact-info">
                                <h2>Contact Us</h2>
                                <p><strong>Address:</strong> 123 Culinary Street, Foodville, FC 12345</p>
                                <p><strong>Phone:</strong> (555) 123-4567</p>
                                <p><strong>Email:</strong> info@savorybites.com</p>
                                <p><strong>Hours:</strong> Mon-Fri: 11am-10pm | Sat-Sun: 10am-11pm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;