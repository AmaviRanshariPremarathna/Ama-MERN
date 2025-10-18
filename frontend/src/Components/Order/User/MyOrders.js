import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userid = localStorage.getItem("userId") || "demoUser";
      const res = await fetch(`/api/orders/user/${userid}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setOrders(data.data || []);
    } catch (_) {
      setError("Could not load orders.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((it) => it.itemName?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="myorders-page">
      <div className="myorders-container">
        <h2>🧾 My Orders</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by Order ID or Book Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            {['All','Pending','Approved','Rejected','Cancelled','Completed'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filtered.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total Items</th>
                <th>Total Price</th>
                <th>Placed On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId || o._id}</td>
                  <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td>
                    <ul className="items-list">
                      {o.items.map((it, idx) => (
                        <li key={idx}><span className="order-book-id">{it.bookId}</span> - {it.itemName} × {it.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{o.totalItems}</td>
                  <td>Rs. {o.totalPrice}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="view-btn" onClick={() => navigate(`/user/orders/${o._id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyOrders;


