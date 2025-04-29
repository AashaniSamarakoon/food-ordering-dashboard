import React from 'react';
import './styles/AboutPage.css';
import './RestaurantMap';

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="header">
                <h1>Savory</h1>
                <p className="tagline">Authentic flavors since 2010</p>
            </div>
            
            <div className="contact-section">
                {/* <h2>Contact Us</h2> */}
                <div className="contact-info">
                    <p><strong>Address:</strong> Homagama, Sri Lanka</p>
                    <p><strong>Phone:</strong>070 3101244</p>
                    <p><strong>Email:</strong>savory@gmail.com</p>
                    <p><strong>Hours:</strong> Mon-Fri: 11am-10pm | Sat-Sun: 10am-11pm</p>
                </div>
            </div>
        </div>



    );
};

export default AboutPage;