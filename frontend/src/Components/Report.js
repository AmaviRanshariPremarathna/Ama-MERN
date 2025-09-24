import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./Report.css";

const Report = () => {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState("");
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const reportRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load books
    const savedBooks = localStorage.getItem('alertsBooks');
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (error) {
        console.error('Error loading saved books:', error);
      }
    }

    // Load mock transaction data
    const mockTransactions = [
      { id: 1, type: "added", item: "React Handbook", user: "John Doe", date: new Date().toISOString(), value: 45.99 },
      { id: 2, type: "borrowed", item: "Python Guide", user: "Jane Smith", date: new Date(Date.now() - 86400000).toISOString(), value: 35.50 },
      { id: 3, type: "returned", item: "JavaScript Bible", user: "Mike Johnson", date: new Date(Date.now() - 172800000).toISOString(), value: 29.99 },
      { id: 4, type: "exchanged", item: "Data Structures", user: "Sarah Wilson", date: new Date(Date.now() - 259200000).toISOString(), value: 52.00 },
      { id: 5, type: "removed", item: "Old Manual", user: "System", date: new Date(Date.now() - 345600000).toISOString(), value: 15.00 }
    ];
    setTransactions(mockTransactions);

    // Load mock users data
    const mockUsers = [
      { id: 1, name: "John Doe", contributions: 15, borrowed: 8, fines: 25.50 },
      { id: 2, name: "Jane Smith", contributions: 12, borrowed: 12, fines: 0 },
      { id: 3, name: "Mike Johnson", contributions: 8, borrowed: 6, fines: 15.75 },
      { id: 4, name: "Sarah Wilson", contributions: 20, borrowed: 15, fines: 5.25 },
      { id: 5, name: "David Brown", contributions: 6, borrowed: 4, fines: 45.00 }
    ];
    setUsers(mockUsers);
  };

  const getStatus = (stock, threshold) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= threshold / 3) return "critical";
    if (stock <= threshold / 2) return "very-low";
    if (stock <= threshold) return "low";
    return "safe";
  };

  // Statistics calculations
  const getTotalValue = () => {
    return books.reduce((total, book) => total + (book.stock * book.price), 0).toFixed(2);
  };

  const getCriticalCount = () => {
    return books.filter(book => getStatus(book.stock, book.threshold) === "critical").length;
  };

  const getOutOfStockCount = () => {
    return books.filter(book => getStatus(book.stock, book.threshold) === "out-of-stock").length;
  };

  const getLowStockCount = () => {
    return books.filter(book => {
      const status = getStatus(book.stock, book.threshold);
      return status === "low" || status === "very-low";
    }).length;
  };

  const getTotalStock = () => {
    return books.reduce((total, book) => total + book.stock, 0);
  };

  const getAveragePrice = () => {
    if (books.length === 0) return 0;
    return (books.reduce((total, book) => total + book.price, 0) / books.length).toFixed(2);
  };

  // Transaction statistics
  const getTransactionsByType = (type) => {
    return transactions.filter(t => t.type === type).length;
  };

  const getTotalFines = () => {
    return users.reduce((total, user) => total + user.fines, 0).toFixed(2);
  };

  const getTopUsers = () => {
    return users.sort((a, b) => b.contributions - a.contributions).slice(0, 5);
  };

  const getPopularBooks = () => {
    // Mock popular books based on stock levels (inverse relationship)
    return books
      .map(book => ({
        ...book,
        popularity: book.threshold - book.stock // Higher difference = more popular
      }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  };

  const getLeastUsedBooks = () => {
    return books
      .filter(book => book.stock === book.threshold) // Never borrowed
      .slice(0, 5);
  };

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const downloadPdf = () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `inventory_report_${reportPeriod}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(reportRef.current).save();
    showNotification("📄 Report exported as PDF successfully!");
  };

  const printReport = () => {
    window.print();
    showNotification("🖨️ Print dialog opened!");
  };

  const getReportTitle = () => {
    const period = reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1);
    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    return `${period} Inventory Report – ${month}`;
  };

  return (
    <div className="report-page">
      {notification && (
        <div className={`notification ${notification.includes("⚠️") || notification.includes("🚨") || notification.includes("❌") ? "warning" : "success"}`}>
          {notification}
        </div>
      )}

      <div className="report-container">
        <header className="report-header">
          <div className="header-content">
            <div className="title-section">
              <h1>📊 {getReportTitle()}</h1>
              <p>Book Exchange Management System</p>
              <div className="report-meta">
                <span className="report-period">
                  📅 Report Period: 
                  <select 
                    value={reportPeriod} 
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="period-select"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </span>
                {reportPeriod === "custom" && (
                  <div className="custom-date-range">
                    <input 
                      type="date" 
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                    />
                    <span>to</span>
                    <input 
                      type="date" 
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn btn-secondary print-btn" onClick={printReport}>
                🖨️ Print Report
              </button>
              <button className="btn btn-primary download-btn" onClick={downloadPdf}>
                📥 Export PDF
              </button>
            </div>
          </div>
        </header>

        <div className="report-content" ref={reportRef}>
          {/* Executive Summary */}
          <section className="summary-section">
            <h2>📈 Executive Summary</h2>
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">📚</div>
                <div className="stat-number">{books.length}</div>
                <div className="stat-label">Total Books</div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">📦</div>
                <div className="stat-number">{getTotalStock()}</div>
                <div className="stat-label">Total Units</div>
              </div>
              <div className="stat-card info">
                <div className="stat-icon">💰</div>
                <div className="stat-number">${getTotalValue()}</div>
                <div className="stat-label">Inventory Value</div>
              </div>
              <div className="stat-card secondary">
                <div className="stat-icon">📊</div>
                <div className="stat-number">${getAveragePrice()}</div>
                <div className="stat-label">Average Price</div>
              </div>
              <div className="stat-card critical">
                <div className="stat-icon">🚨</div>
                <div className="stat-number">{getOutOfStockCount()}</div>
                <div className="stat-label">Out of Stock</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-icon">⚠️</div>
                <div className="stat-number">{getCriticalCount()}</div>
                <div className="stat-label">Critical Stock</div>
              </div>
              <div className="stat-card info">
                <div className="stat-icon">📉</div>
                <div className="stat-number">{getLowStockCount()}</div>
                <div className="stat-label">Low Stock</div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">💵</div>
                <div className="stat-number">${getTotalFines()}</div>
                <div className="stat-label">Total Fines</div>
              </div>
            </div>
          </section>

          {/* Stock Overview */}
          <section className="stock-overview">
            <h2>📋 Stock Overview</h2>
            <div className="category-analysis">
              <h3>Category-wise Summary</h3>
              <div className="category-grid">
                {Object.entries(books.reduce((acc, book) => {
                  if (!acc[book.category]) acc[book.category] = { count: 0, value: 0, stock: 0, lowStock: 0 };
                  acc[book.category].count++;
                  acc[book.category].value += book.stock * book.price;
                  acc[book.category].stock += book.stock;
                  if (getStatus(book.stock, book.threshold) !== "safe") acc[book.category].lowStock++;
                  return acc;
                }, {})).map(([category, stats]) => (
                  <div key={category} className="category-card">
                    <div className="category-header">
                      <h3>{category}</h3>
                      {stats.lowStock > 0 && <span className="alert-badge">{stats.lowStock} alerts</span>}
                    </div>
                    <div className="category-stats">
                      <p><span>📚 Books:</span> {stats.count}</p>
                      <p><span>📦 Stock:</span> {stats.stock} units</p>
                      <p><span>💰 Value:</span> ${stats.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Transaction Summary */}
          <section className="transaction-summary">
            <h2>🔄 Transaction Summary</h2>
            <div className="transaction-stats">
              <div className="transaction-card added">
                <div className="transaction-icon">➕</div>
                <div className="transaction-data">
                  <div className="transaction-number">{getTransactionsByType("added")}</div>
                  <div className="transaction-label">Books Added</div>
                </div>
              </div>
              <div className="transaction-card borrowed">
                <div className="transaction-icon">📖</div>
                <div className="transaction-data">
                  <div className="transaction-number">{getTransactionsByType("borrowed")}</div>
                  <div className="transaction-label">Books Borrowed</div>
                </div>
              </div>
              <div className="transaction-card returned">
                <div className="transaction-icon">↩️</div>
                <div className="transaction-data">
                  <div className="transaction-number">{getTransactionsByType("returned")}</div>
                  <div className="transaction-label">Books Returned</div>
                </div>
              </div>
              <div className="transaction-card exchanged">
                <div className="transaction-icon">🔄</div>
                <div className="transaction-data">
                  <div className="transaction-number">{getTransactionsByType("exchanged")}</div>
                  <div className="transaction-label">Books Exchanged</div>
                </div>
              </div>
              <div className="transaction-card removed">
                <div className="transaction-icon">🗑️</div>
                <div className="transaction-data">
                  <div className="transaction-number">{getTransactionsByType("removed")}</div>
                  <div className="transaction-label">Books Removed</div>
                </div>
              </div>
            </div>
            
            <div className="recent-transactions">
              <h3>Recent Transactions</h3>
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Item</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 10).map(transaction => (
                      <tr key={transaction.id}>
                        <td>
                          <span className={`transaction-type ${transaction.type}`}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </td>
                        <td>{transaction.item}</td>
                        <td>{transaction.user}</td>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>${transaction.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Performance Insights */}
          <section className="performance-insights">
            <h2>🎯 Performance Insights</h2>
            
            <div className="insights-grid">
              <div className="insight-card">
                <h3>📈 Most Popular Books</h3>
                <div className="insight-list">
                  {getPopularBooks().map((book, index) => (
                    <div key={book.id} className="insight-item">
                      <span className="rank">#{index + 1}</span>
                      <div className="item-info">
                        <div className="item-title">{book.title}</div>
                        <div className="item-author">{book.author}</div>
                      </div>
                      <span className="popularity-score">{book.popularity} requests</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="insight-card">
                <h3>📉 Least Used Books</h3>
                <div className="insight-list">
                  {getLeastUsedBooks().map((book, index) => (
                    <div key={book.id} className="insight-item">
                      <span className="rank">#{index + 1}</span>
                      <div className="item-info">
                        <div className="item-title">{book.title}</div>
                        <div className="item-author">{book.author}</div>
                      </div>
                      <span className="unused-badge">Never borrowed</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="insight-card">
                <h3>👥 Top Contributors</h3>
                <div className="insight-list">
                  {getTopUsers().map((user, index) => (
                    <div key={user.id} className="insight-item">
                      <span className="rank">#{index + 1}</span>
                      <div className="item-info">
                        <div className="item-title">{user.name}</div>
                        <div className="item-stats">
                          {user.contributions} contributions • {user.borrowed} borrowed
                        </div>
                      </div>
                      <span className="contribution-score">{user.contributions}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Alerts & Notifications */}
          <section className="alerts-section">
            <h2>🚨 Alerts & Notifications</h2>
            
            <div className="alerts-grid">
              <div className="alert-panel critical">
                <h3>🔴 Critical Alerts</h3>
                <div className="alert-list">
                  {books.filter(book => getStatus(book.stock, book.threshold) === "out-of-stock" || getStatus(book.stock, book.threshold) === "critical").map(book => (
                    <div key={book.id} className="alert-item">
                      <span className="alert-icon">⚠️</span>
                      <div className="alert-info">
                        <div className="alert-title">{book.title}</div>
                        <div className="alert-message">
                          {getStatus(book.stock, book.threshold) === "out-of-stock" ? "Out of stock" : `Critical low: ${book.stock} remaining`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert-panel warning">
                <h3>🟡 Low Stock Warnings</h3>
                <div className="alert-list">
                  {books.filter(book => getStatus(book.stock, book.threshold) === "low" || getStatus(book.stock, book.threshold) === "very-low").map(book => (
                    <div key={book.id} className="alert-item">
                      <span className="alert-icon">⚠️</span>
                      <div className="alert-info">
                        <div className="alert-title">{book.title}</div>
                        <div className="alert-message">Low stock: {book.stock} remaining (threshold: {book.threshold})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert-panel info">
                <h3>📋 Overdue Items</h3>
                <div className="alert-list">
                  {users.filter(user => user.fines > 0).map(user => (
                    <div key={user.id} className="alert-item">
                      <span className="alert-icon">⏰</span>
                      <div className="alert-info">
                        <div className="alert-title">{user.name}</div>
                        <div className="alert-message">Outstanding fine: ${user.fines.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>


          {/* Report Footer */}
          <footer className="report-footer">
            <div className="footer-content">
              <div className="generated-info">
                <p><strong>Generated on:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Report ID:</strong> RPT-{new Date().getTime()}</p>
                <p><strong>Generated by:</strong> Book Exchange Management System v2.0</p>
              </div>
              <div className="footer-stats">
                <p><strong>Total Categories:</strong> {new Set(books.map(book => book.category)).size}</p>
                <p><strong>Active Users:</strong> {users.length}</p>
                <p><strong>Total Transactions:</strong> {transactions.length}</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Report;