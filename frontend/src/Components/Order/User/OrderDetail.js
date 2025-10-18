import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetail.css";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setOrder(data.data);
    } catch (_) {
      setOrder(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrder(); // eslint-disable-next-line
  }, [id]);

  const cancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      await fetchOrder();
    } catch (e) { alert(e.message || "Failed to cancel"); }
  };

  const del = async () => {
    if (!window.confirm("Delete this order?")) return;
    try {
      // If pending, cancel first so backend allows deletion
      if (order.status === 'Pending') {
        await fetch(`/api/orders/${id}/cancel`, { method: "PATCH" });
      }
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      navigate("/user/orders");
    } catch (e) { alert(e.message || "Failed to delete"); }
  };

  const editOrder = () => {
    if (!order || !order.items || order.items.length === 0) return;
    const first = order.items[0];
    const book = { itemName: first.itemName, bookId: first.bookId, _id: first.bookId, price: first.price };
    navigate("/user/add-order", {
      state: {
        book,
        editing: true,
        existingOrderId: order._id,
        preset: {
          customerName: order.customerName || order.username,
          customerContact: order.customerContact || "",
          quantity: first.quantity
        }
      }
    });
  };

  const toPay = () => {
    // Mark paid first, then navigate to existing payment UI
    fetch(`/api/orders/${id}/paid`, { method: "PATCH" })
      .finally(() => {
        navigate("/payment", { state: { orderId: order._id, amount: order.totalPrice } });
      });
  };

  if (loading) return <div className="orderdetail-page"><div className="orderdetail-container"><p>Loading...</p></div></div>;
  if (!order) return <div className="orderdetail-page"><div className="orderdetail-container"><p>Order not found.</p></div></div>;

  const canEditOrDelete = ['Completed','Cancelled','Rejected'].includes(order.status);

  return (
    <div className="orderdetail-page">
      <div className="orderdetail-container">
        <button className="view-btn" onClick={() => navigate("/user/orders")}>← Back</button>
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
          <div className="actions-row">
            {order.status === 'Pending' && (
              <>
                <button className="view-btn" onClick={editOrder}>Edit Order</button>
                <button className="view-btn danger" onClick={del}>Delete Order</button>
              </>
            )}
            {['Completed','Cancelled','Rejected'].includes(order.status) && (
              <button className="view-btn muted" onClick={del}>Delete Order</button>
            )}
            {order.status === 'Approved' && (
              <button className="view-btn primary" onClick={toPay}>Click to Pay</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;


