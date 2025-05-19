import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './styles/Menu.css';
import { Link } from "react-router-dom";
import { menuItemService } from '../../api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMenuItems();
        
        // Add refresh logic on navigation/URL change
        const handleRouteChange = () => {
            fetchMenuItems();
        };
        
        // Listen for navigation events
        window.addEventListener('popstate', handleRouteChange);
        
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
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
            console.log("Fetching menu items from API...");
            const data = await menuItemService.getAllMenuItems();
            console.log("Menu items loaded:", data);
            setMenuItems(Array.isArray(data) ? data : []);
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
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error occurred. Please try again later.';
                }
            } else if (!navigator.onLine) {
                errorMessage = 'You are offline. Please check your internet connection.';
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Refresh button handler
    const handleRefresh = () => {
        fetchMenuItems();
        toast.info('Refreshing menu items...');
    };

    const refreshButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        color: '#000',
        fontSize: '16px'
    };

    // Handle deleting a menu item
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

    // Handle changing a menu item's status
    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE';
            const updatedItem = await menuItemService.updateMenuItemStatus(id, newStatus);
            
            setMenuItems(menuItems.map(item => 
                item.id === id ? updatedItem : item
            ));
            
            toast.success(`Status updated to ${newStatus === 'AVAILABLE' ? 'available' : 'out of stock'}`);
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
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/dashboard/menu/add" className="add-item-btn">
                        + Add New Item
                    </Link>
                    
                    {/* Refresh button with FontAwesome icon */}
                    <button 
                        onClick={handleRefresh}
                        style={refreshButtonStyle}
                        title="Refresh menu items"
                    >
                        <FontAwesomeIcon icon={faSync} />
                    </button>
                </div>
            </div>

            {/* Filters */}
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
                                No menu items found. Click "Add New Item" to create one.
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