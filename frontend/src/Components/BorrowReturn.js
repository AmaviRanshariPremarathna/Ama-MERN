import React, { useState, useEffect, useCallback } from "react";
import { FaBook, FaBookReader, FaExclamationTriangle, FaClock } from "react-icons/fa";
import "./BorrowReturn.css";

const BorrowReturn = () => {
  const [activeTab, setActiveTab] = useState("borrow");
  const [books, setBooks] = useState([
    { id: 1, title: "Database Systems", author: "Elmasri", status: "Available" },
    { id: 2, title: "Operating Systems", author: "Silberschatz", status: "Available" },
    { id: 3, title: "Computer Networks", author: "Tanenbaum", status: "Available" },
    { id: 4, title: "Software Engineering", author: "Pressman", status: "Available" },
    { id: 5, title: "Data Structures", author: "Cormen", status: "Available" },
  ]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [fineRate] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load demo borrowed books for testing (can be removed in production)
  useEffect(() => {
    // Add some demo overdue books for testing
    const demoOverdueBook = {
      id: 999,
      title: "Demo Overdue Book",
      author: "Test Author",
      borrowerName: "John Doe",
      borrowerId: "ID-123",
      borrowDate: new Date(Date.now() - (20 * 24 * 60 * 60 * 1000)).toISOString(), // 20 days ago
      dueDate: new Date(Date.now() - (6 * 24 * 60 * 60 * 1000)).toISOString(), // 6 days overdue
      status: "Borrowed",
      isReturned: false
    };
    
    const demoBorrowedBook = {
      id: 998,
      title: "Demo Borrowed Book",
      author: "Demo Author", 
      borrowerName: "Jane Smith",
      borrowerId: "ID-456",
      borrowDate: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)).toISOString(), // 5 days ago
      dueDate: new Date(Date.now() + (9 * 24 * 60 * 60 * 1000)).toISOString(), // 9 days remaining
      status: "Borrowed",
      isReturned: false
    };

    setBorrowedBooks([demoOverdueBook, demoBorrowedBook]);
    setBooks(prev => prev.map(book => 
      book.id === 2 ? { ...book, status: "Borrowed" } : book
    ));
  }, []); // Run once on component mount

  // Real-time clock and overdue status updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time tracking

    return () => clearInterval(timer);
  }, []);

  // Helper function to check if a book is overdue
  const isOverdue = useCallback((book) => {
    if (!book.dueDate) return false;
    return currentTime > new Date(book.dueDate);
  }, [currentTime]);

  // Helper function to calculate days remaining or overdue
  const getDaysInfo = useCallback((book) => {
    if (!book.dueDate) return { type: 'unknown', days: 0 };
    
    const dueDate = new Date(book.dueDate);
    const timeDiff = dueDate.getTime() - currentTime.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff > 0) {
      return { type: 'remaining', days: daysDiff };
    } else if (daysDiff === 0) {
      return { type: 'due-today', days: 0 };
    } else {
      return { type: 'overdue', days: Math.abs(daysDiff) };
    }
  }, [currentTime]);

  // Enhanced fine calculation with real-time updates
  const calculateFine = useCallback((book) => {
    if (!isOverdue(book)) return 0;
    
    const daysInfo = getDaysInfo(book);
    if (daysInfo.type === 'overdue') {
      return daysInfo.days * fineRate;
    }
    return 0;
  }, [isOverdue, getDaysInfo, fineRate]);

  // Calculate real-time statistics with overdue detection
  const availableCount = books.filter((b) => b.status === "Available").length;
  const borrowedCount = borrowedBooks.filter((b) => !isOverdue(b)).length;
  const overdueCount = borrowedBooks.filter((b) => isOverdue(b)).length;

  // Animated counters with real-time updates
  const [counterAvailable, setCounterAvailable] = useState(0);
  const [counterBorrowed, setCounterBorrowed] = useState(0);
  const [counterOverdue, setCounterOverdue] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCounterAvailable(Math.min(step, availableCount));
      setCounterBorrowed(Math.min(step, borrowedCount));
      setCounterOverdue(Math.min(step, overdueCount));
      if (step >= Math.max(availableCount, borrowedCount, overdueCount)) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [availableCount, borrowedCount, overdueCount]);

  // Enhanced borrow function with automatic deadline creation
  const handleBorrow = (book) => {
    if (book.status === "Borrowed") {
      alert("This book is already borrowed!");
      return;
    }
    
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14); // Exactly 2 weeks deadline
    
    const borrowerName = prompt("Enter borrower name:") || "Anonymous";
    const borrowerId = prompt("Enter borrower ID:") || `ID-${Date.now()}`;
    
    const newBorrowRecord = { 
      ...book, 
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      borrowerName,
      borrowerId,
      status: "Borrowed",
      isReturned: false
    };
    
    // Add to borrowed books and update book status
    setBorrowedBooks(prev => [...prev, newBorrowRecord]);
    setBooks(prev => prev.map(b => 
      b.id === book.id ? { ...b, status: "Borrowed" } : b
    ));
    
    alert(`Book borrowed successfully!\nBorrower: ${borrowerName}\nDue Date: ${dueDate.toDateString()}\nRemember: Return within 14 days to avoid fine!`);
  };

  // Enhanced return function with real-time fine calculation
  const handleReturn = (book) => {
    const returnDate = new Date();
    const fine = calculateFine(book);
    const daysInfo = getDaysInfo(book);
    
    let statusMessage = `Book Returned: ${book.title}\nBorrower: ${book.borrowerName || 'Unknown'}\nReturn Date: ${returnDate.toDateString()}`;
    
    if (fine > 0) {
      statusMessage += `\n⚠️ OVERDUE: ${daysInfo.days} days late\n💰 Fine: Rs.${fine}`;
    } else if (daysInfo.type === 'due-today') {
      statusMessage += `\n✅ Returned on time (Due today)`;
    } else {
      statusMessage += `\n✅ Returned on time (${daysInfo.days} days early)`;
    }
    
    alert(statusMessage);
    
    // Remove from borrowed books and update book status
    setBorrowedBooks(prev => prev.filter(b => b.id !== book.id));
    setBooks(prev => prev.map(b => 
      b.id === book.id ? { ...b, status: "Available" } : b
    ));
  };

  return (
    <div className="borrow-return-premium">
      {/* Live Updates Indicator */}
      <div className="live-indicator">
        🔴 LIVE
      </div>
      
      <div className="header-section">
        <h1>📚 Library Borrow & Return Management</h1>
        <div className="real-time-clock">
          <FaClock style={{marginRight: '8px'}} />
          Current Time: {currentTime.toLocaleString()}
        </div>
      </div>

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
          📚 Borrow Books
        </button>
        <button className={activeTab === "return" ? "tab active" : "tab"} onClick={() => setActiveTab("return")}>
          📖 Return Books
        </button>
        <button className={activeTab === "overdue" ? "tab active" : "tab"} onClick={() => setActiveTab("overdue")}>
          ⚠️ Overdue Books ({overdueCount})
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

      {/* Return Grid - Only show borrowed books that are not overdue */}
      {activeTab === "return" && (
        <div className="book-grid">
          {borrowedBooks.filter((b) => !isOverdue(b) && b.title.toLowerCase().includes(search.toLowerCase()))
            .map((book, idx) => {
              const daysInfo = getDaysInfo(book);
              return (
                <div key={book.id} className="book-card borrowed-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p>Borrower: {book.borrowerName}</p>
                  <p>Borrowed: {new Date(book.borrowDate).toDateString()}</p>
                  <p>Due: {new Date(book.dueDate).toDateString()}</p>
                  {daysInfo.type === 'due-today' && (
                    <p style={{color: '#f39c12', fontWeight: 'bold'}}>⏰ DUE TODAY!</p>
                  )}
                  {daysInfo.type === 'remaining' && (
                    <p style={{color: '#27ae60', fontWeight: 'bold'}}>📅 {daysInfo.days} days remaining</p>
                  )}
                  <span className="badge borrowed">On Time</span>
                  <button className="btn return-btn" onClick={() => handleReturn(book)}>Return Book</button>
                </div>
              );
            })}
          {borrowedBooks.filter((b) => !isOverdue(b)).length === 0 && <p className="no-books">No borrowed books to return.</p>}
        </div>
      )}

      {/* Overdue Grid - Only show overdue books */}
      {activeTab === "overdue" && (
        <div className="book-grid">
          {borrowedBooks.filter((b) => isOverdue(b) && b.title.toLowerCase().includes(search.toLowerCase()))
            .map((book, idx) => {
              const daysInfo = getDaysInfo(book);
              const fine = calculateFine(book);
              return (
                <div key={book.id} className="book-card overdue-card glow" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p>Borrower: {book.borrowerName}</p>
                  <p>Borrowed: {new Date(book.borrowDate).toDateString()}</p>
                  <p>Was Due: {new Date(book.dueDate).toDateString()}</p>
                  <p className="fine">🚨 OVERDUE: {daysInfo.days} days</p>
                  <p className="fine">💰 Fine: Rs.{fine}</p>
                  <span className="badge overdue">OVERDUE</span>
                  <button className="btn return-btn" onClick={() => handleReturn(book)}>
                    Return & Pay Fine (Rs.{fine})
                  </button>
                </div>
              );
            })}
          {borrowedBooks.filter((b) => isOverdue(b)).length === 0 && (
            <div className="no-books">
              <p>🎉 No overdue books! All borrowers are on time.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowReturn;
