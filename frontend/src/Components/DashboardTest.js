// Test component to verify DashboardContext is working
import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

const DashboardTest = () => {
  const { dashboardData } = useDashboard();
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>Dashboard Context Test</h3>
      <p>Products: {dashboardData.products.length}</p>
      <p>Suppliers: {dashboardData.suppliers.length}</p>
      <p>Inventory: {dashboardData.inventory.length}</p>
      <p>Loading: {dashboardData.loading ? 'Yes' : 'No'}</p>
      <p>Last Updated: {dashboardData.lastUpdated ? dashboardData.lastUpdated.toLocaleTimeString() : 'Never'}</p>
    </div>
  );
};

export default DashboardTest;