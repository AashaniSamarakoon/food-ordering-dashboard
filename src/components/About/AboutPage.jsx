// import React from 'react';
// import RestaurantMap from './RestaurantMap';
// import './styles/AboutPage.css';
//
// const AboutPage = () => {
//     return (
//         <div className="standalone-about-page">
//             <div className="hero-section">
//                 <div className="hero-content">
//                     <h1>Savory Bites</h1>
//                     <p className="tagline">Authentic flavors since 2010</p>
//                 </div>
//             </div>
//
//             <div className="about-content">
//                 <div className="text-section">
//                     <h2>Our Story</h2>
//                     <p>
//                         Founded in 2010, Savory Bites began as a small family-owned restaurant with a passion for
//                         bringing authentic flavors to our community. What started as a humble kitchen has grown
//                         into a beloved dining destination, known for our commitment to quality ingredients and
//                         traditional recipes with a modern twist.
//                     </p>
//
//                     <h2>Our Services</h2>
//                     <ul className="services-list">
//                         <li>
//                             <strong>Dine-in Experience:</strong> Enjoy our cozy atmosphere with seating for 50 guests
//                         </li>
//                         <li>
//                             <strong>Takeout & Delivery:</strong> Available through our app and major delivery platforms
//                         </li>
//                         <li>
//                             <strong>Catering:</strong> Full-service catering for events from 20 to 200 people
//                         </li>
//                         <li>
//                             <strong>Cooking Classes:</strong> Monthly classes with our head chef
//                         </li>
//                     </ul>

//                     <div className="contact-info">
//                         <h2>Contact Us</h2>
//                         <p><strong>Address:</strong> 123 Culinary Street, Foodville, FC 12345</p>
//                         <p><strong>Phone:</strong> (555) 123-4567</p>
//                         <p><strong>Email:</strong> info@savorybites.com</p>
//                         <p><strong>Hours:</strong> Mon-Fri: 11am-10pm | Sat-Sun: 10am-11pm</p>
//                     </div>
//                 </div>
//
//                 <div className="map-section">
//                     <RestaurantMap />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default AboutPage;

import React from 'react';

const AboutPage = () => {
    return (
        <div style={{
            fontFamily: "'Arial', sans-serif",
            color: "#333",
            width: "100%",
            minHeight: "100vh",
            margin: 0,
            padding: 0
        }}>
            {/* Hero Section with Background Image */}
            <div style={{
                position: "relative",
                height: "400px",
                background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center",
                backgroundSize: "cover",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "white",
                marginBottom: "40px"
            }}>
                <h1 style={{
                    fontSize: "3.5rem",
                    marginBottom: "10px",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                }}>
                    Savory Bites
                </h1>
                <p style={{
                    fontSize: "1.5rem",
                    fontStyle: "italic",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"
                }}>
                    Authentic flavors since 2010
                </p>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "0 20px"
            }}>
                {/*<section>*/}
                {/*    <h2 style={{*/}
                {/*        color: "#d4a762",*/}
                {/*        fontSize: "2rem",*/}
                {/*        marginTop: "30px"*/}
                {/*    }}>*/}
                {/*        Our Story*/}
                {/*    </h2>*/}
                {/*    <p style={{ lineHeight: "1.6" }}>*/}
                {/*        Founded in 2010, Savory Bites began as a small family-owned restaurant with a passion for*/}
                {/*        bringing authentic flavors to our community. What started as a humble kitchen has grown*/}
                {/*        into a beloved dining destination, known for our commitment to quality ingredients and*/}
                {/*        traditional recipes with a modern twist.*/}
                {/*    </p>*/}
                {/*</section>*/}
                {/*<section>*/}
                {/*    <h2 style={{*/}
                {/*        color: "#d4a762",*/}
                {/*        fontSize: "2rem",*/}
                {/*        marginTop: "30px"*/}
                {/*    }}>Our Services</h2>*/}
                {/*    <ul className="services-list">*/}
                {/*        <li>*/}
                {/*            <strong>Dine-in Experience:</strong> Enjoy our cozy atmosphere with seating for 50 guests*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <strong>Takeout & Delivery:</strong> Available through our app and major delivery platforms*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <strong>Catering:</strong> Full-service catering for events from 20 to 200 people*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <strong>Cooking Classes:</strong> Monthly classes with our head chef*/}
                {/*        </li>*/}
                {/*    </ul>*/}

                {/*</section>*/}

                <section>
                    <h2 style={{
                        color: "#d4a762",
                        fontSize: "2rem",
                        marginTop: "30px"
                    }}>Contact Us</h2>

                    <p><strong>Address:</strong> 123 Culinary Street, Foodville, FC 12345</p>
                    <p><strong>Phone:</strong> (555) 123-4567</p>
                    <p><strong>Email:</strong> info@savorybites.com</p>
                    <p><strong>Hours:</strong> Mon-Fri: 11am-10pm | Sat-Sun: 10am-11pm</p>

                </section>
            </div>
        </div>
    );
};

export default AboutPage;