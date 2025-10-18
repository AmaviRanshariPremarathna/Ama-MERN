import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookList.css";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders/books");
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed");
        setBooks(data.data || []);
      } catch (e) {
        setError("Could not load books.");
      } finally { setLoading(false); }
    };
    fetchBooks();
  }, []);

  const addSampleBooks = async () => {
    setSeeding(true);
    try {
      const samples = [
        { itemName: "Clean Code", quantity: 10, price: 3500 },
        { itemName: "You Don't Know JS", quantity: 8, price: 2800 },
        { itemName: "Eloquent JavaScript", quantity: 12, price: 3000 }
      ];
      for (const s of samples) {
        await fetch("/api/orders/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(s)
        });
      }
      // refresh list
      const res = await fetch("/api/orders/books");
      const data = await res.json();
      setBooks(data.data || []);
    } catch (_) {
      setError("Failed to add sample books");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="books-page">
      <div className="books-container">
        <h2>📚 Books</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="books-grid">
            {books.map((b) => (
              <div key={b._id} className="book-card">
                <div className="book-title">{b.itemName}</div>
                <div>Price: Rs. {b.price}</div>
                <div>Available: {b.quantity}</div>
                <button className="view-btn" onClick={() => navigate("/user/add-order", { state: { book: b } })}>Place an Order</button>
              </div>
            ))}
            {books.length === 0 && (
              <div>
                <button className="view-btn" onClick={addSampleBooks} disabled={seeding}>
                  {seeding ? "Adding..." : "Add Sample Books"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;


