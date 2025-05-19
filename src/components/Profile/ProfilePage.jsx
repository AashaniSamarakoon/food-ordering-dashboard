import React, { useState, useEffect } from 'react';
import { faUser, faPen, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { restaurantService } from '../../api';
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  const [tempData, setTempData] = useState({ ...profileData });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const data = await restaurantService.getRestaurantDetails();
      
      setProfileData({
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        role: 'RESTAURANT_ADMIN'
      });
      setTempData(profileData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        email: tempData.email,
        phone: tempData.phone,
        address: tempData.address,
        role: tempData.role
      };

      await restaurantService.updateRestaurantDetails(updatedData);
      setProfileData(tempData);
      setIsEditing(false);
      await fetchProfileData();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
  };

  const renderProfileIcon = () => {
    const letter = profileData.email ? profileData.email.charAt(0).toUpperCase() : 'A';
    return (
      <div className="profile-icon-container">
        <div className="profile-icon">
          {letter}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          {renderProfileIcon()}
          <div className="header-content">
            <h2>Admin Profile</h2>
            {!isEditing && (
              <button className="edit-btn" onClick={handleEdit}>
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-main">
          {isEditing ? (
            <form className="profile-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={tempData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={tempData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={tempData.role}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={tempData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-buttons">
                <button type="button" className="save-btn" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} /> Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{profileData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{profileData.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{profileData.role}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{profileData.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;