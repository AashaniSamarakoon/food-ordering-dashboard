// import React from 'react';
// import './styles/TopNav.css';
// import { faSearch, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const TopNav = () => {
//     return (
//         <div className="top-nav">
//             <div className="search-bar">
//                 <FontAwesomeIcon icon={faSearch} className="search-icon" />
//                 <input type="text" placeholder="Search orders, customers..." />
//             </div>
//             <div className="nav-right">
//                 <button className="notification-btn">
//                     <FontAwesomeIcon icon={faBell} />
//                     <span className="notification-badge">3</span>
//                 </button>
//                 <div className="profile">
//                     <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//                     <span className="profile-name">Admin User</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TopNav;


import React from 'react';
import './styles/TopNav.css';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
    const navigate = useNavigate();
    const userName = "Admin User"; // Define the user name here

    const handleProfileClick = () => {
        navigate('/dashboard/profile');
    };

    return (
        <div className="top-nav">
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Search orders, customers..." />
            </div>
            <div className="nav-right">
                <button className="notification-btn">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="notification-badge">3</span>
                </button>
                <div className="profile" onClick={handleProfileClick}>
                    <div className="profile-icon-placeholder">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="profile-name">{userName}</span>
                </div>
            </div>
        </div>
    );
};

export default TopNav;