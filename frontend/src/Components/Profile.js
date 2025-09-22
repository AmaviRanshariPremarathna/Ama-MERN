// Profile.js
import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  // Original data backup for cancel
  const originalData = {
    firstName: "Natasha",
    lastName: "Khaleja",
    dateOfBirth: "1990-10-12",
    email: "inventory@bookexchange.com",
    phone: "+44 212 554 846",
    role: "Inventory Manager",
    country: "United Kingdom",
    city: "Leeds, East London",
    postalCode: "EBT 254"
  };

  const [isEditing, setIsEditing] = useState(null); // null = view, 'personal' or 'address' = edit
  const [formData, setFormData] = useState({ ...originalData });
  const [errors, setErrors] = useState({});

  const validateForm = (section) => {
    const newErrors = {};
    if (section === 'personal') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    } else if (section === 'address') {
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = (section) => {
    if (!validateForm(section)) {
      console.error('Validation failed:', errors);
      return;
    }
    // Simulate API call to save
    console.log(`Saving ${section} details:`, formData);
    // In real app: await api.updateProfile(formData);
    alert(`Successfully saved ${section} details!`); // Temporary feedback
    setIsEditing(null);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setErrors({});
    setIsEditing(null);
  };

  const handleEdit = (section) => {
    if (isEditing === section) {
      handleSave(section);
    } else {
      setIsEditing(section);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      
      <div className="profile-card">
        <div className="profile-photo">
          <div className="photo-placeholder">
            <span>NK</span>
          </div>
        </div>
        <div className="profile-info">
          <h2>{formData.firstName} {formData.lastName}</h2>
          <p className="location">Leeds, United Kingdom</p>
          <div className="profile-stats">
            <span className="stat">📚 Books Managed: 1,247</span>
            <span className="stat">📖 Active Listings: 89</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3>Personal Information</h3>
          <button 
            className={`edit-btn ${isEditing === 'personal' ? 'save-mode' : ''}`}
            onClick={() => handleEdit('personal')}
          >
            {isEditing === 'personal' ? 'Save' : 'Edit'}
          </button>
        </div>
        
        <div className="info-grid">
          <div className="info-row">
            <label>First Name</label>
            {isEditing === 'personal' ? (
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`edit-input ${errors.firstName ? 'error' : ''}`}
              />
            ) : (
              <span>{formData.firstName}</span>
            )}
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>
          
          <div className="info-row">
            <label>Last Name</label>
            {isEditing === 'personal' ? (
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`edit-input ${errors.lastName ? 'error' : ''}`}
              />
            ) : (
              <span>{formData.lastName}</span>
            )}
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
          
          <div className="info-row">
            <label>Date of Birth</label>
            {isEditing === 'personal' ? (
              <input 
                type="date" 
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`edit-input ${errors.dateOfBirth ? 'error' : ''}`}
              />
            ) : (
              <span>12-10-1990</span>
            )}
            {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
          </div>
          
          <div className="info-row">
            <label>Email Address</label>
            {isEditing === 'personal' ? (
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`edit-input ${errors.email ? 'error' : ''}`}
              />
            ) : (
              <span>{formData.email}</span>
            )}
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="info-row">
            <label>Phone Number</label>
            {isEditing === 'personal' ? (
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="edit-input"
              />
            ) : (
              <span>(+44) 212 554 846</span>
            )}
          </div>
          
          <div className="info-row">
            <label>User Role</label>
            <span className="role-badge">{formData.role}</span>
          </div>
          
          <div className="info-row">
            <label>Employee ID</label>
            <span>BEI-2023-045</span>
          </div>
          
          <div className="info-row">
            <label>Join Date</label>
            <span>15-03-2023</span>
          </div>
        </div>
        
        {isEditing === 'personal' && (
          <div className="edit-actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h3>Address</h3>
          <button 
            className={`edit-btn ${isEditing === 'address' ? 'save-mode' : ''}`}
            onClick={() => handleEdit('address')}
          >
            {isEditing === 'address' ? 'Save' : 'Edit'}
          </button>
        </div>
        
        <div className="address-grid">
          <div className="address-row">
            <label>Country</label>
            {isEditing === 'address' ? (
              <select 
                name="country" 
                value={formData.country}
                onChange={handleInputChange}
                className={`edit-input ${errors.country ? 'error' : ''}`}
              >
                <option value="">Select Country</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Sri Lanaka">Sri Lanka</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            ) : (
              <span>{formData.country}</span>
            )}
            {errors.country && <span className="error-text">{errors.country}</span>}
          </div>
          
          <div className="address-row">
            <label>City</label>
            {isEditing === 'address' ? (
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`edit-input ${errors.city ? 'error' : ''}`}
              />
            ) : (
              <span>{formData.city}</span>
            )}
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
          
          <div className="address-row">
            <label>Postal Code</label>
            {isEditing === 'address' ? (
              <input 
                type="text" 
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`edit-input ${errors.postalCode ? 'error' : ''}`}
              />
            ) : (
              <span>{formData.postalCode}</span>
            )}
            {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
          </div>
        </div>
        
        {isEditing === 'address' && (
          <div className="edit-actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h3>Inventory Manager Settings</h3>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Book Condition Guidelines</label>
            <span className="status-badge active">Enabled</span>
          </div>
          <div className="setting-item">
            <label>Inventory Audit Frequency</label>
            <span>Monthly</span>
          </div>
          <div className="setting-item">
            <label>Max Books per Listing</label>
            <span>25 books</span>
          </div>
          <div className="setting-item">
            <label>Notification Preferences</label>
            <span className="status-badge">Email & SMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;