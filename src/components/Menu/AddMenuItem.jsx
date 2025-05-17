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
            
            console.log('Form data to submit:', formData);
            
            // Prepare JSON data
            const menuItemData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                status: formData.status, 
                description: formData.description || "",
                imageUrl: formData.imageUrl || previewImage || "https://via.placeholder.com/150?text=No+Image" // Use URL or preview image
            };
            
            console.log('Sending to API:', menuItemData);
            
            // Call API to create menu item
            const result = await menuItemService.createMenuItem(menuItemData);
            console.log('API response:', result);
            
            toast.success('Menu item added successfully!');
            navigate('/dashboard/menu');
        } catch (error) {
            console.error('Failed to add menu item:', error);
            
            let errorMessage = 'Failed to add menu item.';
            
            // Extract more specific error details if available
            if (error.response) {
                console.error('API Error Details:', error.response.data);
                
                if (error.response.data && error.response.data.details) {
                    errorMessage += ' ' + error.response.data.details;
                } else if (error.response.data && error.response.data.error) {
                    errorMessage += ' ' + error.response.data.error;
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
                    description: '',
                    imageUrl: ''
                }}
            />
        </div>
    );
};

export default AddMenuItem;