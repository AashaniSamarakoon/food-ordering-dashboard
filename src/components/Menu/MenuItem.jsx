import React from 'react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MenuItem = ({ item }) => {
    return (
        <tr className={`menu-item ${item.status === 'Out of Stock' ? 'out-of-stock' : ''}`}>
            <td>{item.id}</td>
            <td className="item-with-image">
                <div className="item-image-container">
                    <img
                        src={item.image || '/images/default-food.jpg'}
                        alt={item.name}
                        onError={(e) => {
                            e.target.src = '/images/default-food.jpg';
                        }}
                    />
                </div>
                <span>{item.name}</span>
            </td>
            <td>{item.category}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
        <span className={`status-badge ${item.status === 'Available' ? 'available' : 'out-of-stock'}`}>
          {item.status}
        </span>
            </td>
            <td className="actions">
                <button className="edit-btn">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-btn">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );
};

export default MenuItem;