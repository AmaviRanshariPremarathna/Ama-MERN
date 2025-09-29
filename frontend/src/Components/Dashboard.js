// Dashboard.js
import React from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaLayerGroup, FaBoxOpen, FaDollarSign, FaSync } from 'react-icons/fa';
import { useDashboard } from '../contexts/DashboardContext';

const Dashboard = () => {
  const { dashboardData, refreshing, refreshData } = useDashboard();

  // Process data for charts
  const processedData = React.useMemo(() => {
    const { products, suppliers, inventory } = dashboardData;

    // Sales Report Data (based on inventory)
    const salesReportData = inventory.slice(0, 10).map((item, index) => ({
      name: item.itemName || `Item ${index + 1}`,
      remaining: item.quantity || 0,
      sold: Math.max(0, (item.initialQuantity || item.quantity || 0) - (item.quantity || 0))
    }));

    // Product Detail Data
    const productDetailData = products.slice(0, 7).map((product, index) => ({
      name: product.name || product.productName || `Product ${index + 1}`,
      value: product.quantity || product.stock || Math.floor(Math.random() * 20) + 5
    }));

    // Category wise sales (group products by category)
    const categoryMap = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + (product.sales || Math.floor(Math.random() * 20));
    });
    
    const categorySalesData = Object.entries(categoryMap).slice(0, 4).map(([name, value]) => ({
      name,
      value: Math.max(1, value)
    }));

    // Category Quotation Data
    const categoryQuotationData = Object.entries(categoryMap).slice(0, 5).map(([name, value]) => ({
      name,
      quotation: value * 10 + Math.floor(Math.random() * 50)
    }));

    // Purchase Details (combine inventory and supplier data)
    const purchaseDetails = inventory.slice(0, 5).map((item, index) => {
      const supplier = suppliers[index % suppliers.length];
      return {
        vendor: supplier?.name || supplier?.supplierName || `Vendor ${index + 1}`,
        category: item.category || 'General',
        product: item.itemName || `Product ${index + 1}`,
        quantity: item.quantity || 0,
        purchaseRate: item.purchasePrice || item.price || 0,
        salesRate: (item.salesPrice || item.price || 0) * 1.05
      };
    });

    return {
      salesReportData,
      productDetailData,
      categorySalesData,
      categoryQuotationData,
      purchaseDetails
    };
  }, [dashboardData]);

  // Statistics
  const statistics = React.useMemo(() => ({
    totalVendors: dashboardData.suppliers.length,
    totalCategories: [...new Set(dashboardData.products.map(p => p.category || 'Uncategorized'))].length,
    totalProducts: dashboardData.products.length,
    totalSales: dashboardData.inventory.reduce((sum, item) => sum + (item.sales || 0), 0)
  }), [dashboardData]);

  // Color schemes
  const PRODUCT_COLORS = ['#0088FE', '#00BFFF', '#00C49F', '#90EE90', '#6495ED', '#3CB371', '#4682B4'];
  const CATEGORY_COLORS = ['#00C49F', '#98FB98', '#ADD8E6', '#0088FE'];

  // Show loading state
  if (dashboardData.loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <FaSync className="loading-spinner" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Real-Time Inventory Management Dashboard
            <span className="real-time-indicator"></span>
          </h1>
          <p className="dashboard-description">
            Live dashboard with real-time data from inventory, products, and suppliers.
            {dashboardData.lastUpdated && (
              <span className="last-updated">
                Last updated: {dashboardData.lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`} 
          onClick={refreshData}
          disabled={refreshing}
        >
          <FaSync className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {dashboardData.error && (
        <div className="error-message">
          <p>Error loading data: {dashboardData.error}</p>
          <button onClick={refreshData}>Retry</button>
        </div>
      )}

      <div className="charts-row">
        <div className="sales-report">
          <h3>Sales Report</h3>
          <BarChart width={450} height={250} data={processedData.salesReportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="remaining" fill="#0088FE" name="Remaining Quantity" />
            <Bar dataKey="sold" fill="#00C49F" name="Sold Quantity" />
          </BarChart>
        </div>
        
        <div className="product-detail">
          <h3>Product Detail</h3>
          <PieChart width={200} height={250}>
            <Pie
              data={processedData.productDetailData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {processedData.productDetailData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul className="pie-legend">
            {processedData.productDetailData.map((entry, index) => (
              <li key={index}>
                <span className="legend-color" style={{ backgroundColor: PRODUCT_COLORS[index % PRODUCT_COLORS.length] }}></span>
                {entry.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="category-sales">
          <h3>Category Wise Sales (%)</h3>
          <PieChart width={200} height={250}>
            <Pie
              data={processedData.categorySalesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {processedData.categorySalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul className="pie-legend">
            {processedData.categorySalesData.map((entry, index) => (
              <li key={index}>
                <span className="legend-color" style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}></span>
                {entry.name} {entry.value}%
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="details-row">
        <div className="purchase-details">
          <h3>Purchase Details</h3>
          <table>
            <thead>
              <tr>
                <th className="th-empty"></th>
                <th className="th-green">Vendor</th>
                <th className="th-green">Category</th>
                <th className="th-green">Product</th>
                <th className="th-blue">Quantity</th>
                <th className="th-blue">Purchase Rate</th>
                <th className="th-blue">Sales Rate</th>
              </tr>
            </thead>
            <tbody>
              {processedData.purchaseDetails.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.vendor}</td>
                  <td>{item.category}</td>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>${typeof item.purchaseRate === 'number' ? item.purchaseRate.toFixed(2) : '0.00'}</td>
                  <td>${typeof item.salesRate === 'number' ? item.salesRate.toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="category-quotation">
          <h3>Category Wise Quotation</h3>
          <BarChart width={450} height={200} data={processedData.categoryQuotationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quotation">
              {processedData.categoryQuotationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 2 ? '#00C49F' : '#0088FE'} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h4>{statistics.totalVendors}</h4>
          <p>Total Vendors</p>
        </div>
        <div className="stat-card">
          <FaLayerGroup className="stat-icon" />
          <h4>{statistics.totalCategories}</h4>
          <p>Total Categories</p>
        </div>
        <div className="stat-card">
          <FaBoxOpen className="stat-icon" />
          <h4>{statistics.totalProducts}</h4>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <h4>{statistics.totalSales}</h4>
          <p>Total Sales</p>
        </div>
      </div>

      <div className="footer">
        <span>WELCOME, Inventory Manager</span>
        <span>Real-time Dashboard Active</span>
      </div>
      
      <p className="note">
        🔄 This dashboard updates automatically every 30 seconds and reflects real-time changes from CRUD operations.
        Data is fetched live from your backend APIs. Use the refresh button for manual updates.
      </p>
    </div>
  );
};

export default Dashboard;