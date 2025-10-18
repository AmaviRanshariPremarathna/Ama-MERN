import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrdersDashboard() {
  const navigate = useNavigate();
  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2>📦 Orders - Admin Dashboard</h2>
        <p>Manage all orders from here.</p>
        <button className="view-btn" onClick={() => navigate("/admin/orders")}>Go to Orders Table</button>
      </div>
    </div>
  );
}

export default AdminOrdersDashboard;


