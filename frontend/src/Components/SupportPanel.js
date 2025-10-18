import React, { useState } from 'react';
import { FaTicketAlt, FaChartBar, FaUsers, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import TicketDashboard from './HelpDesk/user/TicketDashboard';
import AdminTicketList from './HelpDesk/admin/AdminTicketList';
import AdminOrders from './Order/Admin/AdminOrders';
import MyOrders from './Order/User/MyOrders';
import AdminUsers from './User/Admin/AdminUsers';
import AdminStats from './HelpDesk/admin/AdminStats';
import '../Components/PanelLayout.css';
import './UserPanel.css';

const SupportPanel = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('tickets');
  const { user, isLoggedIn } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@gmail.com';

  const menuItems = [
    { id: 'tickets', label: 'Tickets', icon: <FaTicketAlt /> },
    { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'stats', label: 'Statistics', icon: <FaChartBar /> },
  ];

  const renderMainContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="panel-login-prompt">
          <h2>Please log in to access Support</h2>
          <p>You need to be logged in to view support tickets and orders.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'tickets':
        return isAdmin ? <AdminTicketList /> : <TicketDashboard />;
      case 'orders':
        return isAdmin ? <AdminOrders /> : <MyOrders />;
      case 'users':
        return isAdmin ? <AdminUsers /> : (
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Only administrators can view user management.</p>
          </div>
        );
      case 'stats':
        return isAdmin ? <AdminStats /> : (
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Only administrators can view statistics.</p>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      <div className="panel-layout" style={{ marginTop: '80px' }}>
        {/* Sidebar */}
        <div className="panel-sidebar">
          <div className="sidebar-header">
            <h3>🎧 Support</h3>
            <p>Help & Support System</p>
          </div>
          <nav className="sidebar-nav">
            <button 
              className="nav-item back-to-home"
              onClick={() => setCurrentPage('home')}
            >
              🏠 Back to Home
            </button>
            
            {/* Menu Items */}
            {menuItems.map(item => (
              <button 
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon} {item.label}
              </button>
            ))}
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

export default SupportPanel;