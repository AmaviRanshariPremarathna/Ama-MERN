import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddOrder.css";

function AddOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book || null;
  const [customerName, setCustomerName] = useState(state?.preset?.customerName || localStorage.getItem("username") || "");
  const [customerContact, setCustomerContact] = useState(state?.preset?.customerContact || "");
  const [quantity, setQuantity] = useState(state?.preset?.quantity || 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isTenDigitNumber = (value) => /^\d{10}$/.test(String(value).trim());

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!book) { setError("No book selected"); return; }
    if (!customerName || customerName.trim().length < 2) { setError("Customer name must be at least 2 characters"); return; }
    if (!customerContact || customerContact.trim().length === 0) { setError("Contact number is required"); return; }
    if (!isTenDigitNumber(customerContact)) { setError("Contact number must be exactly 10 digits"); return; }
    const qty = Number.parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty <= 0) { setError("Quantity must be a positive integer"); return; }
    setSaving(true);
    try {
      const userId = localStorage.getItem("userId") || "demoUser";
      const username = localStorage.getItem("username") || "Demo";
      const payload = {
        items: [{ bookId: book.bookId || book._id, quantity: qty }],
        userid: userId,
        username,
        customerName,
        customerContact,
        bookName: book.itemName,
        orderDate: new Date().toISOString()
      };
      const res = await fetch(state?.editing ? `/api/orders/${state.existingOrderId}` : "/api/orders", {
        method: state?.editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || (state?.editing?"Failed to update order":"Failed to create order"));
      navigate(state?.editing ? "/user/orders" : "/user/orders");
    } catch (e) {
      setError(e.message || "Failed to create order");
    } finally { setSaving(false); }
  };

  return (
    <div className="addorder-page">
      <div className="addorder-container">
        <h2>📝 Add Order</h2>
        {!book ? (
          <p>Please select a book from the list.</p>
        ) : (
          <form onSubmit={submit} className="addorder-form">
            <div className="form-row">
              <label>Customer Name</label>
              <input type="text" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Contact Number</label>
              <input
                type="tel"
                value={customerContact}
                onChange={(e)=>setCustomerContact(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit number"
              />
            </div>
            <div className="form-row">
              <label>Book</label>
              <div className="static-field">{book.itemName} ({book.bookId || book._id})</div>
            </div>
            <div className="form-row">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e)=>setQuantity(e.target.value)}
                min={1}
                step={1}
                placeholder="Enter quantity"
              />
            </div>
            {error && <div className="error-text">{error}</div>}
            <div className="actions-row">
              <button type="button" className="view-btn muted" onClick={()=>navigate(state?.editing ? "/user/orders" : "/user/books")}>Cancel</button>
              <button type="submit" className="view-btn" disabled={saving}>{saving? (state?.editing?"Updating...":"Placing...") : (state?.editing?"Update Order":"Place Order")}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddOrder;


