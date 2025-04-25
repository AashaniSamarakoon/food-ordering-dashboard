import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Sidebar.css';
import {
    faHome,
    faUtensils,
    faUsers,
    faCog,
    faSignOutAlt, faClipboardList, faPiggyBank, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">FoodDash</div>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className="nav-item">
                    <FontAwesomeIcon icon={faHome} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/dashboard/menu" className="nav-item">
                    <FontAwesomeIcon icon={faUtensils} />
                    <span>Menu Items</span>
                </Link>

                <Link to="/dashboard/orders" className="nav-item">
                    <FontAwesomeIcon icon={faClipboardList} />
                    <span>Orders</span>
                </Link>
                <Link to="/dashboard/banking" className="nav-item">
                    <FontAwesomeIcon icon={faPiggyBank} />
                    <span>Banking</span>
                </Link>

                <Link to="/dashboard/customers" className="nav-item">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                </Link>
                <Link to="/dashboard/about" className="nav-item">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>About Us</span>
                </Link>
                <Link to="/dashboard/settings" className="nav-item">
                    <FontAwesomeIcon icon={faCog} />
                    <span>Settings</span>
                </Link>
            </nav>
            <div className="sidebar-footer">
                <a href="#" className="nav-item">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;


//
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './styles/Sidebar.css';
// import {
//     faHome,
//     faUtensils,
//     faUsers,
//     faCog,
//     faSignOutAlt, faClipboardList, faPiggyBank, faInfoCircle
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//
// const Sidebar = () => {
//     return (
//         <div className="sidebar">
//             <div className="sidebar-logo">FoodDash</div>
//             <nav className="sidebar-nav">
//                 <Link to="/" className="nav-item">
//                     <FontAwesomeIcon icon={faHome} />
//                     <span>Dashboard</span>
//                 </Link>
//                 <Link to="/menu" className="nav-item">
//                     <FontAwesomeIcon icon={faUtensils} />
//                     <span>Menu Items</span>
//                 </Link>
//
//                 <Link to="/orders" className="nav-item">
//                     <FontAwesomeIcon icon={faClipboardList} />
//                     <span>Orders</span>
//                 </Link>
//                 <Link to="/banking" className="nav-item">
//                     <FontAwesomeIcon icon={faPiggyBank} />
//                     <span>Banking</span>
//                 </Link>
//
//                 <Link to="/customers" className="nav-item">
//                     <FontAwesomeIcon icon={faUsers} />
//                     <span>Customers</span>
//                 </Link>
//                 <Link to="/about" className="nav-item">
//                     <FontAwesomeIcon icon={faInfoCircle} />
//                     <span>About Us</span>
//                 </Link>
//                 <Link to="/settings" className="nav-item">
//                     <FontAwesomeIcon icon={faCog} />
//                     <span>Settings</span>
//                 </Link>
//             </nav>
//             <div className="sidebar-footer">
//                 <a href="#" className="nav-item">
//                     <FontAwesomeIcon icon={faSignOutAlt} />
//                     <span>Logout</span>
//                 </a>
//             </div>
//         </div>
//     );
// };
//
// export default Sidebar;