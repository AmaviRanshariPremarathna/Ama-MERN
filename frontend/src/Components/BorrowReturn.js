import React, { useState, useEffect } from "react";
import { FaBook, FaBookReader, FaExclamationTriangle } from "react-icons/fa";
import "./BorrowReturn.css";

const BorrowReturn = () => {
  const [activeTab, setActiveTab] = useState("borrow");
  const [books, setBooks] = useState([
    { id: 1, title: "Database Systems", author: "Elmasri", status: "Available" },
    { id: 2, title: "Operating Systems", author: "Silberschatz", status: "Borrowed" },
    { id: 3, title: "Computer Networks", author: "Tanenbaum", status: "Available" },
  ]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [fineRate] = useState(10);

  // Animated counters
  const [counterAvailable, setCounterAvailable] = useState(0);
  const [counterBorrowed, setCounterBorrowed] = useState(0);
  const [counterOverdue, setCounterOverdue] = useState(0);

  const availableCount = books.filter((b) => b.status === "Available").length;
  const borrowedCount = borrowedBooks.length;
  const overdueCount = borrowedBooks.filter((b) => new Date() > b.dueDate).length;

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCounterAvailable(Math.min(step, availableCount));
      setCounterBorrowed(Math.min(step, borrowedCount));
      setCounterOverdue(Math.min(step, overdueCount));
      if (step >= Math.max(availableCount, borrowedCount, overdueCount)) clearInterval(interval);
    }, 50);
  }, [availableCount, borrowedCount, overdueCount]);

  const handleBorrow = (book) => {
    if (book.status === "Borrowed") return alert("This book is already borrowed!");
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14);
    const newRecord = { ...book, borrowDate, dueDate, status: "Borrowed" };
    setBorrowedBooks([...borrowedBooks, newRecord]);
    setBooks(books.map((b) => (b.id === book.id ? { ...b, status: "Borrowed" } : b)));
  };

  const handleReturn = (book) => {
    const returnDate = new Date();
    const borrowed = borrowedBooks.find((b) => b.id === book.id);
    let fine = 0;
    if (returnDate > borrowed.dueDate) {
      const daysLate = Math.ceil((returnDate - borrowed.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * fineRate;
    }
    alert(`Book Returned: ${book.title}\nReturn Date: ${returnDate.toDateString()}\nFine: Rs.${fine}`);
    setBorrowedBooks(borrowedBooks.filter((b) => b.id !== book.id));
    setBooks(books.map((b) => (b.id === book.id ? { ...b, status: "Available" } : b)));
  };

  const calculateFine = (book) => {
    const today = new Date();
    if (today > book.dueDate) {
      const daysLate = Math.ceil((today - book.dueDate) / (1000 * 60 * 60 * 24));
      return daysLate * fineRate;
    }
    return 0;
  };

  return (
    <div className="borrow-return-premium">
      <h1>📚 Library Borrow & Return</h1>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="dashboard-card available">
          <FaBook size={30} />
          <h2>{counterAvailable}</h2>
          <p>Available Books</p>
        </div>
        <div className="dashboard-card borrowed">
          <FaBookReader size={30} />
          <h2>{counterBorrowed}</h2>
          <p>Borrowed Books</p>
        </div>
        <div className="dashboard-card overdue">
          <FaExclamationTriangle size={30} />
          <h2>{counterOverdue}</h2>
          <p>Overdue Books</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "borrow" ? "tab active" : "tab"} onClick={() => setActiveTab("borrow")}>
          Borrow
        </button>
        <button className={activeTab === "return" ? "tab active" : "tab"} onClick={() => setActiveTab("return")}>
          Return
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Borrow Grid */}
      {activeTab === "borrow" && (
        <div className="book-grid">
          {books.filter((b) => b.status === "Available" && b.title.toLowerCase().includes(search.toLowerCase()))
            .map((book, idx) => (
              <div key={book.id} className="book-card available-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <span className="badge available">Available</span>
                <button className="btn borrow-btn" onClick={() => handleBorrow(book)}>Borrow</button>
              </div>
            ))}
          {books.filter((b) => b.status === "Available").length === 0 && <p className="no-books">No available books.</p>}
        </div>
      )}

      {/* Return Grid */}
      {activeTab === "return" && (
        <div className="book-grid">
          {borrowedBooks.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
            .map((book, idx) => (
              <div key={book.id} className={`book-card ${calculateFine(book) > 0 ? 'overdue-card glow' : 'borrowed-card'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <h3>{book.title}</h3>
                <p>Borrowed: {book.borrowDate.toDateString()}</p>
                <p>Due: {book.dueDate.toDateString()}</p>
                {calculateFine(book) > 0 && <p className="fine">⚠ Fine: Rs.{calculateFine(book)}</p>}
                <button className="btn return-btn" onClick={() => handleReturn(book)}>Return</button>
              </div>
            ))}
          {borrowedBooks.length === 0 && <p className="no-books">No borrowed books to return.</p>}
        </div>
      )}
    </div>
  );
};

export default BorrowReturn;
