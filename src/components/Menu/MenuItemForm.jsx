import React, { useState } from 'react';
import './styles/Form.css';

const MenuItemForm = ({ onSubmit, onImageChange, previewImage, initialValues, loading, fileInputRef }) => {
    const [formData, setFormData] = useState(initialValues);
    const [imageSource, setImageSource] = useState('url');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create a copy of formData with mapped status
        const submissionData = {
            ...formData,
            status: formData.status === 'Available' ? 'AVAILABLE' : 'OUT_OF_STOCK',
            image: previewImage
        };
        
        console.log('Form submission data:', submissionData);
        onSubmit(submissionData);
    };

    const handleUploadClick = () => {
        setImageSource('file');
        fileInputRef.current.click();
    };

    return (
        <form className="menu-item-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label>Item Name*</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category*</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="Pizza">Pizza</option>
                        <option value="Burger">Burger</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Salad">Salad</option>
                        <option value="Drink">Drink</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Price*</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Status*</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
            
                <div className="form-group image-upload">
                    <label>Item Image</label>
                    <div className="image-upload-container">
                        {/* Toggle between URL input and file upload */}
                        <div className="image-source-toggle" style={{ marginBottom: '10px' }}>
                            <button 
                                type="button"
                                onClick={() => setImageSource('url')}
                                style={{
                                    backgroundColor: imageSource === 'url' ? '#007bff' : '#f8f9fa',
                                    color: imageSource === 'url' ? 'white' : 'black',
                                    border: '1px solid #ddd',
                                    padding: '5px 10px',
                                    borderRadius: '4px 0 0 4px'
                                }}
                            >
                                Image URL
                            </button>
                            <button 
                                type="button"
                                onClick={() => setImageSource('file')}
                                style={{
                                    backgroundColor: imageSource === 'file' ? '#007bff' : '#f8f9fa',
                                    color: imageSource === 'file' ? 'white' : 'black',
                                    border: '1px solid #ddd',
                                    padding: '5px 10px',
                                    borderRadius: '0 4px 4px 0'
                                }}
                            >
                                Upload File
                            </button>
                        </div>

                        {/* Image preview */}
                        {(previewImage || formData.imageUrl) && (
    <img 
        src={imageSource === 'file' ? previewImage : formData.imageUrl} 
        alt="Preview" 
        className="image-preview" 
        style={{
            maxWidth: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
        }}
        onError={(e) => {
            console.warn("Image failed to load:", e.target.src);
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/200x150?text=Invalid+URL";
        }}
    />
)}

                        {/* URL input or file upload based on selected option */}
                        {imageSource === 'url' ? (
                            <div className="url-input-container" style={{ marginTop: '10px', width: '100%' }}>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl || ''}
                                    onChange={handleChange}
                                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>
                        ) : (
                            <div className="file-upload-container">
                                {!previewImage && (
                                    <div className="image-placeholder">
                                        <span>No image selected</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className="image-input"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                <button 
                                    type="button" 
                                    className="upload-button"
                                    onClick={handleUploadClick}
                                >
                                    {previewImage ? 'Change Image' : 'Upload Image'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Processing...' : initialValues.id ? 'Update Menu Item' : 'Add Menu Item'}
                </button>
            </div>
        </form>
    );
};

export default MenuItemForm;