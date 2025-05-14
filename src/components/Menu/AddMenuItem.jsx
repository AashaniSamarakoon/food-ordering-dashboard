import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItemForm from './MenuItemForm';
import { menuItemService } from '../../api';
import './styles/AddMenuItem.css';
import { toast } from 'react-toastify';

const AddMenuItem = () => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            
            console.log('Form data:', formData);
            
            // Convert frontend status format to backend format
            const statusMapping = {
                'Available': 'AVAILABLE',
                'Out of Stock': 'OUT_OF_STOCK'
            };
            
            // Prepare JSON data without file
            const menuItemData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                status: statusMapping[formData.status],
                description: formData.description || "",
                imageUrl: previewImage || "" // Use the preview image URL
            };
            
            console.log('Sending to API:', menuItemData);
            
            // Call API to create menu item
            const result = await menuItemService.createMenuItem(menuItemData);
            console.log('API response:', result);
            
            toast.success('Menu item added successfully!');
            navigate('/dashboard/menu');
        } catch (error) {
            console.error('Failed to add menu item:', error);
            
            // More detailed error message
            let errorMessage = 'Failed to add menu item. Please try again.';
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Authentication failed. Please log in again.';
                } else if (error.response.status === 403) {
                    errorMessage = 'You do not have permission to add menu items.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = `Error: ${error.response.data.message}`;
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="add-menu-item-container">
            <div className="form-header">
                <h2>Add New Menu Item</h2>
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard/menu')}
                >
                    ← Back to Menu
                </button>
            </div>

            <MenuItemForm
                onSubmit={handleSubmit}
                onImageChange={handleImageChange}
                previewImage={previewImage}
                loading={loading}
                fileInputRef={fileInputRef}
                initialValues={{
                    name: '',
                    category: 'Pizza',
                    price: '',
                    status: 'Available',
                    description: ''
                }}
            />
        </div>
    );
};

export default AddMenuItem;