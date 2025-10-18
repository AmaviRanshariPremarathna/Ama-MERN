import React from "react";
import "./FinanceSidebar.css";

function FinanceSidebar({ activeSection, setActiveSection, isAdmin }) {
  const adminSections = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'wallet', label: 'Wallet Management', icon: '💰' },
    { key: 'payment', label: 'Payment', icon: '💳' },
    { key: 'refund', label: 'Refund Request', icon: '↩️' },
    { key: 'fines', label: 'Fines', icon: '⚠️' },
    { key: 'reports', label: 'Reports', icon: '📈' }
  ];

  const userSections = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'payment', label: 'Payment', icon: '💳' },
    { key: 'refund', label: 'Request Refund', icon: '↩️' },
    { key: 'fines', label: 'My Fines', icon: '⚠️' },
    { key: 'transactions', label: 'Transactions', icon: '📋' }
  ];

  const sections = isAdmin ? adminSections : userSections;

  return (
    <div className="finance-sidebar">
      <div className="finance-sidebar-logo">
        💰 Finance Management
      </div>
      <nav className="finance-sidebar-links">
        {sections.map((section) => (
          <button
            key={section.key}
            className={`finance-nav-item ${activeSection === section.key ? 'active' : ''}`}
            onClick={() => setActiveSection(section.key)}
          >
            <span className="nav-icon">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default FinanceSidebar;