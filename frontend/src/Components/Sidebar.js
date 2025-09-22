// Sidebar.js
import React from 'react';
import './Sidebar.css';
import { 
  FaHome, 
  FaBox, 
  FaTh, 
  FaTruck, 
  FaUsers, 
  FaCog, 
} from 'react-icons/fa';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Inventory MS</h2>
      <ul className="sidebar-menu">

        {/* ✅ Home link */}
        <li 
          className={`menu-item ${currentPage === 'home' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('home')}
        >
          <FaHome className="menu-icon" />
          <span>Home</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('dashboard')}
        >
          <FaBox className="menu-icon" />
          <span>Dashboard</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'products' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('products')}
        >
          <FaTh className="menu-icon" />
          <span>Products</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'categories' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('categories')}
        >
          <FaTh className="menu-icon" />
          <span>Categories</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'alerts' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('alerts')}
        >
          <FaTruck className="menu-icon" />
          <span>Alerts</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'suppliers' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('suppliers')}
        >
          <FaUsers className="menu-icon" />
          <span>Suppliers</span>
        </li>

        <li 
          className={`menu-item ${currentPage === 'profile' ? 'active' : ''}`} 
          onClick={() => setCurrentPage('profile')}
        >
          <FaCog className="menu-icon" />
          <span>Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
