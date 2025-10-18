import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaUserShield, FaUserCog } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Footer from './Common/Footer';
import UserManagement from './UserManagement';
import Login from './User/Login';
import Register from './User/Register';
import AdminUsers from './User/Admin/AdminUsers';
import AdminUserDetail from './User/Admin/AdminUserDetail';
import '../Components/PanelLayout.css';
import './UserPanel.css';

const UserPanel = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('admin-users');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { user, isLoggedIn, logout } = useAuth();

  // Check for initial auth mode from sessionStorage
  useEffect(() => {
    const storedAuthMode = sessionStorage.getItem('authMode');
    if (storedAuthMode && (storedAuthMode === 'login' || storedAuthMode === 'register')) {
      setAuthMode(storedAuthMode);
      // Clear it after using
      sessionStorage.removeItem('authMode');
    }
  }, []);

  // Listen for storage events to handle auth mode changes when already on the page
  useEffect(() => {
    const handleStorageChange = () => {
      const storedAuthMode = sessionStorage.getItem('authMode');
      if (storedAuthMode && (storedAuthMode === 'login' || storedAuthMode === 'register')) {
        setAuthMode(storedAuthMode);
        sessionStorage.removeItem('authMode');
      }
    };

    // Listen for custom event
    window.addEventListener('authModeChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('authModeChanged', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    // Redirect to home page after successful login
    if (setCurrentPage) {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('admin-users'); // Set to manage users
  };

  const renderMainContent = () => {
    // If user is not logged in, show authentication
    if (!isLoggedIn) {
      if (authMode === 'register') {
        return (
          <Register 
            onSuccess={() => setAuthMode('login')}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      } else {
        return (
          <Login 
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        );
      }
    }

    // If user is logged in, show user management content
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'admin-users':
        return <AdminUsers onNavigate={(view, userId) => {
          if (view === 'user-detail') {
            setSelectedUserId(userId);
            setActiveTab('user-detail');
          } else if (view === 'user-edit') {
            setSelectedUserId(userId);
            setActiveTab('user-edit');
          } else if (view === 'user-add') {
            setActiveTab('user-add');
          }
        }} />;
      case 'user-detail':
        return <AdminUserDetail userId={selectedUserId} onBack={() => setActiveTab('admin-users')} />;
      case 'user-edit':
        return (
          <div className="user-edit-content">
            <h2>✏️ Edit User</h2>
            <p>User editing functionality will be implemented here.</p>
            <button 
              onClick={() => setActiveTab('admin-users')}
              style={{ padding: '10px 15px', marginTop: '15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              ← Back to Users
            </button>
          </div>
        );
      case 'user-add':
        return (
          <div className="user-add-content">
            <h2>➕ Add New User</h2>
            <p>User creation functionality will be implemented here.</p>
            <button 
              onClick={() => setActiveTab('admin-users')}
              style={{ padding: '10px 15px', marginTop: '15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              ← Back to Users
            </button>
          </div>
        );
      default:
        return <AdminUsers onNavigate={(view, userId) => {
          if (view === 'user-detail') {
            setSelectedUserId(userId);
            setActiveTab('user-detail');
          } else if (view === 'user-edit') {
            setSelectedUserId(userId);
            setActiveTab('user-edit');
          } else if (view === 'user-add') {
            setActiveTab('user-add');
          }
        }} />; // Default to manage users for admin/staff
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Only show sidebar if user is logged in */}
        {isLoggedIn && (
          <div className="panel-sidebar">
            <div className="sidebar-header">
              <h3>👥 Users</h3>
              <p>Management System</p>
              {isLoggedIn && (
                <div className="user-info">
                  <p>Welcome, {user?.full_name}</p>
                <small>{user?.role}</small>
              </div>
            )}
          </div>
          <nav className="sidebar-nav">
            <button 
              className="nav-item back-to-home"
              onClick={() => window.location.href = '/'}
            >
              🏠 Back to Home
            </button>

            {/* User management options when logged in - Role-based sections */}
            
            {/* Admin/Staff Only Sections */}
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <>
                <button 
                  className={`nav-item ${activeTab === 'admin-users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin-users')}
                >
                  <FaUserShield /> Manage Users
                </button>
              </>
            )}
            
            {/* User Profile Management for Regular Users */}
            {user?.role !== 'admin' && user?.role !== 'staff' && (
              <button 
                className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <FaUserCog /> My Profile
              </button>
            )}
            
            {/* Logout */}
            <button 
              className="nav-item logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>
        )}

        {/* Main Content */}
        <div className={`panel-main ${!isLoggedIn ? 'full-width' : ''}`}>
          {renderMainContent()}
        </div>
      </div>
      
      {/* Footer - Always show for both logged in and not logged in users */}
      <Footer />
    </div>
  );
};

export default UserPanel;
