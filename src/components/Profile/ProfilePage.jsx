// import React, { useState, useRef } from 'react';
// import { faCamera, faPen, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './styles/ProfilePage.css';

// const ProfilePage = () => {
//   const fileInputRef = useRef(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: 'Admin User',
//     email: 'admin@fooddash.com',
//     phone: '+1 234 567 8900',
//     address: '123 Restaurant St, Food City',
//     profilePhoto: null
//   });
//   const [previewPhoto, setPreviewPhoto] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileData(prev => ({ ...prev, profilePhoto: file }));
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewPhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current.click();
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     // Here you would typically save to backend
//   };

//   return (
//     <div className="profile-container">
//       <div className="search-bar">
//         <input 
//           type="text" 
//           placeholder="Search orders, customers..." 
//           className="search-input"
//         />
//       </div>

//       <div className="profile-content">
//         <div className="profile-header">
//           <h2>Profile Details</h2>
//           {!isEditing ? (
//             <button className="edit-btn" onClick={() => setIsEditing(true)}>
//               <FontAwesomeIcon icon={faPen} /> Edit Profile
//             </button>
//           ) : (
//             <div className="edit-actions">
//               <button className="save-btn" onClick={handleSave}>
//                 <FontAwesomeIcon icon={faSave} /> Save
//               </button>
//               <button className="cancel-btn" onClick={() => setIsEditing(false)}>
//                 <FontAwesomeIcon icon={faTimes} /> Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="profile-main">
//           <div className="profile-photo-section">
//             {previewPhoto || profileData.profilePhoto ? (
//               <img 
//                 src={previewPhoto || profileData.profilePhoto} 
//                 alt="Profile" 
//                 className="profile-image"
//               />
//             ) : (
//               <div className="profile-image-placeholder">
//                 {profileData.name.charAt(0).toUpperCase()}
//               </div>
//             )}
//             {isEditing && (
//               <>
//                 <button className="change-photo-btn" onClick={triggerFileInput}>
//                   <FontAwesomeIcon icon={faCamera} /> Change Photo
//                 </button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handlePhotoChange}
//                   accept="image/*"
//                   style={{ display: 'none' }}
//                 />
//               </>
//             )}
//           </div>

//           {isEditing ? (
//             <form className="profile-form">
//               <div className="form-group">
//                 <label>Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={profileData.name}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={profileData.email}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Phone Number</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={profileData.phone}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Address</label>
//                 <textarea
//                   name="address"
//                   value={profileData.address}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </form>
//           ) : (
//             <div className="profile-details">
//               <div className="detail-item">
//                 <span className="detail-label">Name:</span>
//                 <span className="detail-value">{profileData.name}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Email:</span>
//                 <span className="detail-value">{profileData.email}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Phone:</span>
//                 <span className="detail-value">{profileData.phone}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Address:</span>
//                 <span className="detail-value">{profileData.address}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState, useRef } from 'react';
import { faCamera, faPen, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/ProfilePage.css';

const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@fooddash.com',
    phone: '+1 234 567 8900',
    address: '123 Restaurant St, Food City',
    role: 'Administrator',
    joinDate: 'January 1, 2023',
    profilePhoto: null
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [tempData, setTempData] = useState({ ...profileData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ 
      ...tempData,
      profilePhoto: previewPhoto || profileData.profilePhoto 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewPhoto(null);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h2>Admin Profile</h2>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPen} /> Edit Profile
            </button>
          )}
        </div>

        <div className="profile-main">
          <div className="profile-photo-section">
            {previewPhoto || profileData.profilePhoto ? (
              <img 
                src={previewPhoto || profileData.profilePhoto} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <>
                <button className="change-photo-btn" onClick={triggerFileInput}>
                  <FontAwesomeIcon icon={faCamera} /> Change Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>

          {isEditing ? (
        <form className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={tempData.name}
                onChange={handleInputChange}
              />
            </div>
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
          </div>
          
          <div className="form-row">
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

          {/* Changed buttons section - now placed after the form */}
          <div className="form-buttons">
            <div className="form-button-item">
              <button className="save-btn" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Save Changes
              </button>
            </div>
            <div className="form-button-item">
              <button className="cancel-btn" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{profileData.name}</span>
              </div>
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
              <div className="detail-item">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">{profileData.joinDate}</span>
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