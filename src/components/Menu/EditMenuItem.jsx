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
        description: ''
    });

    useEffect(() => {
        // If we have item data from navigation state, use it
        if (location.state?.item) {
            const item = location.state.item;
            setInitialValues({
                name: item.name,
                category: item.category,
                price: item.price.toString(),
                status: item.status,
                description: item.description || ''
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
            const item = await menuItemService.getMenuItem(id);
            
            setInitialValues({
                name: item.name,
                category: item.category,
                price: item.price.toString(),
                status: item.status === 'AVAILABLE' ? 'Available' : 'Out of Stock',
                description: item.description || ''
            });
            
            setPreviewImage(item.imageUrl);
        } catch (error) {
            console.error('Failed to fetch menu item:', error);
            toast.error('Failed to load menu item details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            
            // Convert frontend status format to backend format
            const statusMapping = {
                'Available': 'AVAILABLE',
                'Out of Stock': 'OUT_OF_STOCK'
            };
            
            // Check if we have an actual file to upload
            const imageFile = fileInputRef.current?.files[0];
            if (imageFile) {
                // For file upload we'd normally use FormData
                const apiFormData = new FormData();
                apiFormData.append('name', formData.name);
                apiFormData.append('category', formData.category);
                apiFormData.append('price', parseFloat(formData.price));
                apiFormData.append('status', statusMapping[formData.status]);
                apiFormData.append('description', formData.description || '');
                apiFormData.append('image', imageFile);
                
                // Use the special method for file upload (this would need to be implemented)
                await menuItemService.updateMenuItemWithImage(id, apiFormData);
            } else {
                // Prepare data for API
                const menuItemData = {
                    name: formData.name,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    status: statusMapping[formData.status],
                    description: formData.description || "",
                    imageUrl: formData.image
                };
                
                // Call API to update menu item
                await menuItemService.updateMenuItem(id, menuItemData);
            }
            
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