import React from 'react';
import MenuItem from './MenuItem';
import './styles/Menu.css';
import {Link} from "react-router-dom";

const MenuList = () => {
    const menuItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            category: 'Pizza',
            price: 2400.00,
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 2,
            name: 'Pepperoni Pizza',
            category: 'Pizza',
            price: 2450.00,
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 3,
            name: 'Veggie Burger',
            category: 'Burger',
            price: 700.00,
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 4,
            name: 'Chicken Wings',
            category: 'Appetizer',
            price: 1300.00,
            status: 'Out of Stock',
            image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 5,
            name: 'Caesar Salad',
            category: 'Salad',
            price: 650.00,
            status: 'Available',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
    ];

    return (
        <div className="menu-container">
            <div className="menu-header">
                <h2>Menu Items</h2>
                {/*<button className="add-item-btn">+ Add New Item</button>*/}
                <Link to="/dashboard/menu/add" className="add-item-btn">
                    + Add New Item
                </Link>
            </div>

            <div className="menu-filters">
                <select>
                    <option>All Categories</option>
                    <option>Pizza</option>
                    <option>Burger</option>
                    <option>Appetizer</option>
                    <option>Salad</option>
                </select>
                <input type="text" placeholder="Search menu items..." />
            </div>

            <table className="menu-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {menuItems.map(item => (
                    <MenuItem key={item.id} item={item} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuList;