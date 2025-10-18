import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setOrder(data.data);
    } catch (_) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); // eslint-disable-next-line
  }, [id]);

  const approve = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}/approve`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approvedBy: "Admin" }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      await fetchOrder();
    } catch (e) {
      alert(e.message || "Failed to approve");
    } finally { setSaving(false); }
  };

  const reject = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}/reject`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approvedBy: "Admin" }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      await fetchOrder();
    } catch (e) {
      alert(e.message || "Failed to reject");
    } finally { setSaving(false); }
  };

  const complete = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}/complete`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      await fetchOrder();
    } catch (e) {
      alert(e.message || "Failed to mark as completed");
    } finally { setSaving(false); }
  };

  const del = async () => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      navigate("/orders");
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  };

  if (loading) return <div className="orders-page"><div className="orders-container"><p>Loading order...</p></div></div>;
  if (!order) return <div className="orders-page"><div className="orders-container"><p>Order not found.</p></div></div>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <button className="view-btn" onClick={() => navigate("/orders")}>← Back</button>
        <div className="order-card">
          <div className="order-card-header">
            <div><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></div>
            <div>Order ID: {order.orderId || order._id}</div>
          </div>
          <div className="order-card-body">
            <div><strong>User:</strong> {order.username}</div>
            <div><strong>Items:</strong>
              <ul>
                {order.items.map((it, idx) => (
                  <li key={idx}><span className="order-book-id">{it.bookId}</span> - {it.itemName} × {it.quantity} <span className="order-item-price">Rs. {it.price}</span></li>
                ))}
              </ul>
            </div>
            <div><strong>Total Items:</strong> {order.totalItems}</div>
            <div><strong>Total Price:</strong> Rs. {order.totalPrice}</div>
            <div><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</div>
          </div>
          {order.status === "Pending" && (
            <div className="actions-row">
              <button className="view-btn" onClick={approve} disabled={saving}>Approve</button>
              <button className="view-btn danger" onClick={reject} disabled={saving}>Reject</button>
            </div>
          )}
          {order.status === "Approved" && (
            <div className="actions-row">
              <button className="view-btn primary" onClick={complete} disabled={saving || order.paymentStatus !== 'Paid'}>
                {order.paymentStatus === 'Paid' ? 'Mark as Completed' : 'Waiting for Payment'}
              </button>
            </div>
          )}
          {['Completed','Cancelled','Rejected'].includes(order.status) && (
            <div className="actions-row">
              <button className="view-btn muted" onClick={del}>Delete Order</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;


