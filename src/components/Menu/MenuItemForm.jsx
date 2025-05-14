// import React from 'react';
// import './styles/Form.css';

// const MenuItemForm = ({ onSubmit, onImageChange, previewImage, initialValues }) => {
//     const [formData, setFormData] = React.useState(initialValues);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...formData, image: previewImage });
//     };

//     return (
//         <form className="menu-item-form" onSubmit={handleSubmit}>
//             <div className="form-row">
//                 <div className="form-group">
//                     <label>Item Name*</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Category*</label>
//                     <select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="Pizza">Pizza</option>
//                         <option value="Burger">Burger</option>
//                         <option value="Appetizer">Appetizer</option>
//                         <option value="Salad">Salad</option>
//                         <option value="Drink">Drink</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="form-row">
//                 <div className="form-group">
//                     <label>Price*</label>
//                     <input
//                         type="number"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         min="0"
//                         step="0.01"
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Status*</label>
//                     <select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="Available">Available</option>
//                         <option value="Out of Stock">Out of Stock</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="form-group">
//                 <label>Description</label>
//                 <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="3"
//                 />
//             </div>

//             <div className="form-group image-upload">
//                 <label>Item Image</label>
//                 <div className="image-upload-container">
//                     {previewImage ? (
//                         <img src={previewImage} alt="Preview" className="image-preview" />
//                     ) : (
//                         <div className="image-placeholder">
//                             <span>No image selected</span>
//                         </div>
//                     )}
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={onImageChange}
//                         className="image-input"
//                     />
//                     <button type="button" className="upload-button">
//                         {previewImage ? 'Change Image' : 'Upload Image'}
//                     </button>
//                 </div>
//             </div>

//             <div className="form-actions">
//                 <button type="submit" className="submit-button">
//                     Add Menu Item
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default MenuItemForm;




// import React from 'react';
// import './styles/Form.css';

// const MenuItemForm = ({ onSubmit, onImageChange, previewImage, initialValues }) => {
//     const [formData, setFormData] = React.useState(initialValues);
//     const fileInputRef = React.useRef(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ ...formData, image: previewImage });
//     };

//     const handleUploadClick = () => {
//         fileInputRef.current.click();
//     };

//     return (
//         <form className="menu-item-form" onSubmit={handleSubmit}>
//             <div className="form-row">
//                 <div className="form-group">
//                     <label>Item Name*</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Category*</label>
//                     <select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="Pizza">Pizza</option>
//                         <option value="Burger">Burger</option>
//                         <option value="Appetizer">Appetizer</option>
//                         <option value="Salad">Salad</option>
//                         <option value="Drink">Drink</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="form-row">
//                 <div className="form-group">
//                     <label>Price*</label>
//                     <input
//                         type="number"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         min="0"
//                         step="0.01"
//                         required
//                     />
//                 </div>
//                 <div className="form-row"></div>

//                 <div className="form-group">
//                     <label>Status*</label>
//                     <select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="Available">Available</option>
//                         <option value="Out of Stock">Out of Stock</option>
//                     </select>
//                 </div>
//             </div>
//             <div className="form-row">

//             <div className="form-group">
//                 <label>Description</label>
//                 <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="3"
//                 />
//             </div>
            

//             <div className="form-group image-upload">
//                 <label>Item Image</label>
//                 <div className="image-upload-container">
//                     {previewImage ? (
//                         <img src={previewImage} alt="Preview" className="image-preview" />
//                     ) : (
//                         <div className="image-placeholder">
//                             <span>No image selected</span>
//                         </div>
//                     )}
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={onImageChange}
//                         className="image-input"
//                         ref={fileInputRef}
//                         style={{ display: 'none' }}
//                     />
//                     <button 
//                         type="button" 
//                         className="upload-button"
//                         onClick={handleUploadClick}
//                     >
//                         {previewImage ? 'Change Image' : 'Upload Image'}
//                     </button>
//                 </div>
//             </div>
//             </div>

//             <div className="form-actions">
//                 <button type="submit" className="submit-button">
//                     Add Menu Item
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default MenuItemForm;




import React from 'react';
import './styles/Form.css';

const MenuItemForm = ({ onSubmit, onImageChange, previewImage, initialValues, loading, fileInputRef }) => {
    const [formData, setFormData] = React.useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, image: previewImage });
    };

    const handleUploadClick = () => {
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
                <div className="form-row"></div>

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
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="image-preview" />
                    ) : (
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
            </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Menu Item'}
                </button>
            </div>
        </form>
    );
};

export default MenuItemForm;