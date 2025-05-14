// import React from 'react';
// import MenuItem from './MenuItem';
// import './styles/Menu.css';
// import {Link} from "react-router-dom";

// const MenuList = () => {
//     const menuItems = [
//         {
//             id: 1,
//             name: 'Margherita Pizza',
//             category: 'Pizza',
//             price: 2400.00,
//             status: 'Available',
//             image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
//         },
//         {
//             id: 2,
//             name: 'Pepperoni Pizza',
//             category: 'Pizza',
//             price: 2450.00,
//             status: 'Available',
//             image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
//         },
//         {
//             id: 3,
//             name: 'Veggie Burger',
//             category: 'Burger',
//             price: 700.00,
//             status: 'Available',
//             image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
//         },
//         {
//             id: 4,
//             name: 'Chicken Wings',
//             category: 'Appetizer',
//             price: 1300.00,
//             status: 'Out of Stock',
//             image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
//         },
//         {
//             id: 5,
//             name: 'Caesar Salad',
//             category: 'Salad',
//             price: 650.00,
//             status: 'Available',
//             image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
//         }
//     ];

//     return (
//         <div className="menu-container">
//             <div className="menu-header">
//                 <h2>Menu Items</h2>
//                 {/*<button className="add-item-btn">+ Add New Item</button>*/}
//                 <Link to="/dashboard/menu/add" className="add-item-btn">
//                     + Add New Item
//                 </Link>
//             </div>

//             <div className="menu-filters">
//                 <select>
//                     <option>All Categories</option>
//                     <option>Pizza</option>
//                     <option>Burger</option>
//                     <option>Appetizer</option>
//                     <option>Salad</option>
//                 </select>
//                 <input type="text" placeholder="Search menu items..." />
//             </div>

//             <table className="menu-table">
//                 <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>Item Name</th>
//                     <th>Category</th>
//                     <th>Price</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {menuItems.map(item => (
//                     <MenuItem key={item.id} item={item} />
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default MenuList;




import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './styles/Menu.css';
import { Link } from "react-router-dom";
import { menuItemService } from '../../api';
import { toast } from 'react-toastify';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            
            // Get the authentication token
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You need to log in to view menu items');
                setLoading(false);
                return;
            }
            
            // Try authenticated endpoint with proper authorization
            const data = await menuItemService.getAllMenuItems();
            console.log("Menu items loaded:", data);
            setMenuItems(data || []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            
            // Provide helpful error message
            let errorMessage = 'Failed to load menu items';
            if (error.response) {
                console.error('API Error:', error.response.data);
                
                if (error.response.status === 401) {
                    errorMessage = 'Please log in again to view menu items';
                } else if (error.response.status === 403) {
                    errorMessage = 'You do not have permission to view these menu items';
                }
            } else if (!navigator.onLine) {
                errorMessage = 'You are offline. Please check your internet connection.';
            }
            
            toast.error(errorMessage);
            setMenuItems([]); // Clear any previous data if error
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await menuItemService.deleteMenuItem(id);
                setMenuItems(menuItems.filter(item => item.id !== id));
                toast.success('Menu item deleted successfully');
            } catch (error) {
                console.error('Error deleting menu item:', error);
                toast.error('Failed to delete menu item');
            }
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE';
            const updatedItem = await menuItemService.updateMenuItemStatus(id, newStatus);
            
            setMenuItems(menuItems.map(item => 
                item.id === id ? updatedItem : item
            ));
            
            toast.success(`Status updated to ${newStatus.replace('_', ' ').toLowerCase()}`);
        } catch (error) {
            console.error('Error updating menu item status:', error);
            toast.error('Failed to update status');
        }
    };

    // Filter menu items based on category and search term
    const filteredItems = menuItems.filter(item => {
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="menu-container">
            <div className="menu-header">
                <h2>Menu Items</h2>
                <Link to="/dashboard/menu/add" className="add-item-btn">
                    + Add New Item
                </Link>
            </div>

            <div className="menu-filters">
                <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Salad">Salad</option>
                    <option value="Drink">Drink</option>
                </select>
                <input 
                    type="text" 
                    placeholder="Search menu items..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
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
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <MenuItem 
                                key={item.id} 
                                item={{
                                    ...item,
                                    price: parseFloat(item.price || 0),
                                    status: item.status === 'AVAILABLE' ? 'Available' : 'Out of Stock'
                                }}
                                onDelete={() => handleDeleteItem(item.id)}
                                onStatusChange={() => handleStatusChange(
                                    item.id, 
                                    item.status
                                )}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-items-message">
                                No menu items found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MenuList;