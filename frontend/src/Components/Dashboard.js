// Dashboard.js
import React from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaLayerGroup, FaBoxOpen, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  const salesReportData = [
    { name: '', remaining: 950, sold: 50 },
    { name: '', remaining: 780, sold: 20 },
    { name: '', remaining: 50, sold: 20 },
    { name: '', remaining: 450, sold: 50 },
    { name: '', remaining: 280, sold: 20 },
    { name: '', remaining: 220, sold: 30 },
    { name: '', remaining: 50, sold: 20 },
    { name: '', remaining: 380, sold: 20 },
    { name: '', remaining: 80, sold: 20 },
    { name: '', remaining: 220, sold: 20 },
  ];

  const productDetailData = [
    { name: 'Product 1', value: 12 },
    { name: 'Product 2', value: 18 },
    { name: 'Product 3', value: 10 },
    { name: 'Product 4', value: 15 },
    { name: 'Product 5', value: 8 },
    { name: 'Product 6', value: 20 },
    { name: 'Product 7', value: 17 },
  ];

  const PRODUCT_COLORS = ['#0088FE', '#00BFFF', '#00C49F', '#90EE90', '#6495ED', '#3CB371', '#4682B4'];

  const categorySalesData = [
    { name: 'Category 1', value: 14 },
    { name: 'Category 2', value: 4 },
    { name: 'Category 3', value: 6 },
    { name: 'Category 4', value: 13 },
  ];

  const CATEGORY_COLORS = ['#00C49F', '#98FB98', '#ADD8E6', '#0088FE'];

  const categoryQuotationData = [
    { name: 'Category 1', quotation: 159 },
    { name: 'Category 2', quotation: 33 },
    { name: 'Category 3', quotation: 2 },
    { name: 'Category 4', quotation: 14 },
    { name: 'Category 5', quotation: 2 },
  ];

  const purchaseDetails = [
    { vendor: 'Vendor 1', category: '7th ENG MED', product: 'Product 1', quantity: 3, purchaseRate: 44, salesRate: 46 },
    { vendor: 'Vendor 2', category: '1st ENG MED', product: 'Product 2', quantity: 9, purchaseRate: 44, salesRate: 46 },
    { vendor: 'Vendor 3', category: '1st ENG MED', product: 'Product 3', quantity: 8, purchaseRate: 44, salesRate: 46 },
    { vendor: 'Vendor 4', category: '1st ENG MED', product: 'Product 4', quantity: 1, purchaseRate: 29, salesRate: 31 },
    { vendor: 'Vendor 5', category: '2nd ENG MED', product: 'Product 5', quantity: 3, purchaseRate: 31, salesRate: 33 },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Inventory Management Dashboard</h1>
      <p className="dashboard-description">
        This slide covers the inventory management system wherein vendors, total categories and products, sales are calculated.
      </p>
      <div className="charts-row">
        <div className="sales-report">
          <h3>Sales Report</h3>
          <BarChart width={450} height={250} data={salesReportData}>
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
              data={productDetailData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {productDetailData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul className="pie-legend">
            {productDetailData.map((entry, index) => (
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
              data={categorySalesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {categorySalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul className="pie-legend">
            {categorySalesData.map((entry, index) => (
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
              {purchaseDetails.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.vendor}</td>
                  <td>{item.category}</td>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.purchaseRate}</td>
                  <td>{item.salesRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="category-quotation">
          <h3>Category Wise Quotation</h3>
          <BarChart width={450} height={200} data={categoryQuotationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quotation">
              {categoryQuotationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 2 ? '#00C49F' : '#0088FE'} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h4>66</h4>
          <p>Total Vendors</p>
        </div>
        <div className="stat-card">
          <FaLayerGroup className="stat-icon" />
          <h4>47</h4>
          <p>Total Categories</p>
        </div>
        <div className="stat-card">
          <FaBoxOpen className="stat-icon" />
          <h4>225</h4>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <h4>232</h4>
          <p>Total Sales</p>
        </div>
      </div>
      <div className="footer">
        <span>WELCOME, Inventory</span>
        <span>$ My Salary</span>
      </div>
      <p className="note">This graph/chart is linked to excel, and changes automatically based on data. Just left click on it and select 'Edit Data'.</p>
    </div>
  );
};

export default Dashboard;