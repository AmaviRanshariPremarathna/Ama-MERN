import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function UserOrdersDashboard() {
  const navigate = useNavigate();
  return (
    <div className="myorders-page">
      <div className="myorders-container">
        <h2>🧾 Orders - User Dashboard</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="view-btn" onClick={() => navigate("/user/books")}>Browse Books</button>
          <button className="view-btn" onClick={() => navigate("/user/orders")}>My Orders</button>
        </div>
      </div>
    </div>
  );
}

export default UserOrdersDashboard;


