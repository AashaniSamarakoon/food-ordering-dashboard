import React from 'react';
import { faEdit, faTrash, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ item, onDelete, onStatusChange }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/dashboard/menu/edit/${item.id}`, { state: { item } });
    };

    // More robust image error handling
    const handleImageError = (e) => {
        console.log("Image failed to load:", item.imageUrl);
        e.target.onerror = null; // Prevent infinite loops
        e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
    };

    return (
        <tr className={`menu-item ${item.status === 'Out of Stock' ? 'out-of-stock' : ''}`}>
            <td>{item.id}</td>
            <td className="item-with-image">
                <div className="item-image-container">
                    <img
                        src={item.imageUrl || "https://via.placeholder.com/50x50?text=No+Image"}
                        alt={item.name}
                        onError={handleImageError}
                        style={{ 
                            width: '50px', 
                            height: '50px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                <span style={{ marginLeft: '10px' }}>{item.name}</span>
            </td>
            <td>{item.category}</td>
            <td>LKR {item.price.toFixed(2)}</td>
            <td>
                <span 
                    className={`status-badge ${item.status === 'Available' ? 'available' : 'out-of-stock'}`}
                    onClick={onStatusChange}
                    style={{ 
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: item.status === 'Available' ? '#d4edda' : '#f8d7da',
                        color: item.status === 'Available' ? '#155724' : '#721c24',
                        display: 'inline-flex',
                        alignItems: 'center'
                    }}
                    title="Click to toggle status"
                >
                    <FontAwesomeIcon 
                        icon={faToggleOn} 
                        style={{ marginRight: '5px' }}
                    />
                    {item.status}
                </span>
            </td>
            <td className="actions">
                <button 
                    className="edit-btn" 
                    onClick={handleEdit} 
                    title="Edit menu item"
                    style={{
                        border: 'none',
                        background: 'none',
                        color: '#0d6efd',
                        margin: '0 5px',
                        cursor: 'pointer'
                    }}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                    className="delete-btn" 
                    onClick={onDelete} 
                    title="Delete menu item"
                    style={{
                        border: 'none',
                        background: 'none',
                        color: '#dc3545',
                        margin: '0 5px',
                        cursor: 'pointer'
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );
};

export default MenuItem;