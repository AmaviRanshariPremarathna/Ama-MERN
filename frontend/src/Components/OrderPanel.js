import React, { useState } from 'react';
import { FaTicketAlt, FaChartBar, FaUsers, FaClipboardList, FaShoppingCart, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin, hasPermission } from '../utils/roleUtils';
import Header from './Header';
import AdminTicketList from './HelpDesk/admin/AdminTicketList';
import AdminOrders from './Order/Admin/AdminOrders';
import BookList from './Order/User/BookList';
import MyOrders from './Order/User/MyOrders';
import AdminUsers from './User/Admin/AdminUsers';
import AdminStats from './HelpDesk/admin/AdminStats';
import '../Components/PanelLayout.css';
import './UserPanel.css';

const OrderPanel = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, isLoggedIn } = useAuth();
  const userIsAdmin = isAdmin(user);

  // Permission check component
  const PermissionGuard = ({ permission, children, fallback = null }) => {
    if (!hasPermission(user, permission)) {
      return fallback || (
        <div className="access-denied">
          <h3>🚫 Access Denied</h3>
          <p>You don't have permission to view this section.</p>
          <small>Required permission: {permission}</small>
        </div>
      );
    }
    return children;
  };

  const renderMainContent = () => {
    // If user is not logged in, show login prompt
    if (!isLoggedIn) {
      return (
        <div className="login-required">
          <h2>Login Required</h2>
          <p>Please log in to access the Order Management System.</p>
          <button 
            onClick={() => setCurrentPage('user')}
            className="action-btn"
          >
            Go to Login
          </button>
        </div>
      );
    }

    // Admin Section - Order Management
    if (userIsAdmin) {
      switch (activeTab) {
        case 'orders':
          return <AdminOrders />;
        case 'users':
          return (
            <PermissionGuard permission="manage_users">
              <AdminUsers />
            </PermissionGuard>
          );
        case 'tickets':
          return <AdminTicketList />;
        case 'stats':
          return (
            <PermissionGuard permission="view_analytics">
              <AdminStats />
            </PermissionGuard>
          );
        default:
          return <AdminOrders />;
      }
    }

    // User Section - Shopping & Orders
    switch (activeTab) {
      case 'orders':
        return (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <BookList />
            </div>
            <MyOrders />
          </div>
        );
      case 'my-orders':
        return <MyOrders />;
      case 'books':
        return <BookList />;
      default:
        return (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <BookList />
            </div>
            <MyOrders />
          </div>
        );
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Sidebar */}
        <div className="panel-sidebar">
          <div className="sidebar-header">
            <h3>📊 Order Management</h3>
            <p>{userIsAdmin ? '🔧 Admin Dashboard' : '🛒 Shopping Center'}</p>
            {isLoggedIn && (
              <div className="user-info">
                <span className="user-role">
                  {userIsAdmin ? '👑 Admin' : '👤 User'}
                  {userIsAdmin && <FaShieldAlt style={{ marginLeft: '8px', color: '#f39c12' }} />}
                </span>
                <p>Welcome, {user?.full_name}</p>
                <small>{user?.role || 'user'}</small>
              </div>
            )}
          </div>
          <nav className="sidebar-nav">
            <button 
              className="nav-item back-to-home"
              onClick={() => setCurrentPage('home')}
            >
              🏠 Back to Home
            </button>

            {isLoggedIn && (
              <>
                {/* Admin Section */}
                {userIsAdmin ? (
                  <>
                    <div className="nav-section-header">
                      <h4>🔧 Admin Tools</h4>
                    </div>
                    <button 
                      className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <FaClipboardList /> Order Management
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                      onClick={() => setActiveTab('users')}
                    >
                      <FaUsers /> User Management
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tickets')}
                    >
                      <FaTicketAlt /> Support Tickets
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
                      onClick={() => setActiveTab('stats')}
                    >
                      <FaChartBar /> Analytics
                    </button>
                  </>
                ) : (
                  /* User Section - Only Order-related features */
                  <>
                    <div className="nav-section-header">
                      <h4>🛒 Shopping</h4>
                    </div>
                    <button 
                      className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <FaShoppingCart /> Shop & Orders
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
                      onClick={() => setActiveTab('books')}
                    >
                      <FaClipboardList /> Browse Books
                    </button>
                    <button 
                      className={`nav-item ${activeTab === 'my-orders' ? 'active' : ''}`}
                      onClick={() => setActiveTab('my-orders')}
                    >
                      <FaClipboardList /> My Orders
                    </button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="panel-main">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
