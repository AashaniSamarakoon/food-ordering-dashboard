import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MenuItemForm from './MenuItemForm';
import { menuItemService } from '../../api';
import './styles/AddMenuItem.css';
import { toast } from 'react-toastify';

const EditMenuItem = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [initialValues, setInitialValues] = useState({
        name: '',
        category: 'Pizza',
        price: '',
        status: 'Available',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        // If we have item data from navigation state, use it
        if (location.state?.item) {
            const item = location.state.item;
            setInitialValues({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price.toString(),
                // Map the backend status to frontend status format
                status: item.status === 'AVAILABLE' ? 'Available' : 'Out of Stock',
                description: item.description || '',
                imageUrl: item.imageUrl || ''
            });
            setPreviewImage(item.imageUrl);
        } else {
            // Otherwise fetch from API
            fetchMenuItem();
        }
    }, [id, location.state]);

    const fetchMenuItem = async () => {
        try {
            setLoading(true);
            
            // Fetch from API
            const item = await menuItemService.getMenuItem(id);
            
            setInitialValues({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price.toString(),
                // Map the backend status to frontend status format
                status: item.status === 'AVAILABLE' ? 'Available' : 'Out of Stock',
                description: item.description || '',
                imageUrl: item.imageUrl || ''
            });
            
            setPreviewImage(item.imageUrl);
        } catch (error) {
            console.error('Failed to fetch menu item:', error);
            toast.error('Failed to load menu item details');
            navigate('/dashboard/menu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            
            // Convert status to backend format
            const status = formData.status === 'Available' ? 'AVAILABLE' : 
                          formData.status === 'Out of Stock' ? 'OUT_OF_STOCK' : 
                          formData.status;
                          
            // Use image from file upload or from URL input
            const imageUrl = previewImage || formData.imageUrl || "";
            
            // Prepare data for API
            const menuItemData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                status: status,
                description: formData.description || "",
                imageUrl: imageUrl
            };
            
            console.log('Updating menu item with data:', menuItemData);
            
            // Call API to update menu item
            await menuItemService.updateMenuItem(id, menuItemData);
            
            toast.success('Menu item updated successfully!');
            navigate('/dashboard/menu');
        } catch (error) {
            console.error('Failed to update menu item:', error);
            toast.error('Failed to update menu item. Please try again.');
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
                <h2>Edit Menu Item</h2>
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard/menu')}
                >
                    ← Back to Menu
                </button>
            </div>

            {loading && !initialValues.name ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <MenuItemForm
                    onSubmit={handleSubmit}
                    onImageChange={handleImageChange}
                    previewImage={previewImage}
                    loading={loading}
                    fileInputRef={fileInputRef}
                    initialValues={initialValues}
                />
            )}
        </div>
    );
};

export default EditMenuItem;