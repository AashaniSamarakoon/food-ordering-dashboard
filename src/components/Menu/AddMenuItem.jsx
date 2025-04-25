import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItemForm from './MenuItemForm';
import './styles/AddMenuItem.css';

const AddMenuItem = () => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);

    const handleSubmit = (formData) => {
        console.log('Form submitted:', formData);
        // Here you would typically send data to your backend API
        alert('Menu item added successfully!');
        navigate('/menu');
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