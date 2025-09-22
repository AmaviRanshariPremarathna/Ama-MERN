import React, { useState, useEffect } from "react";
import "./Alerts.css";

const initialBooks = [
  { 
    id: 1, 
    title: "Object Oriented Programming with C++", 
    author: "Balagurusamy", 
    category: "Programming", 
    stock: 5, 
    threshold: 15, 
    price: 38.50, 
    supplier: "CodePress", 
    lastRestocked: "2024-02-10",
    finePerDay: 5.00,
    borrowedCopies: [],
    maxBorrowDays: 14
  },
  { 
    id: 2, 
    title: "Marketing Management", 
    author: "Philip Kotler", 
    category: "Business", 
    stock: 25, 
    threshold: 10, 
    price: 52.75, 
    supplier: "Business Books Inc", 
    lastRestocked: "2024-03-01",
    finePerDay: 5.00,
    borrowedCopies: [],
    maxBorrowDays: 14
  },
  { 
    id: 3, 
    title: "Calculus: Early Transcendentals", 
    author: "James Stewart", 
    category: "Mathematics", 
    stock: 8, 
    threshold: 20, 
    price: 67.99, 
    supplier: "Math Publishers", 
    lastRestocked: "2024-02-28",
    finePerDay: 5.00,
    borrowedCopies: [],
    maxBorrowDays: 14
  },
];

const Alerts = () => {
  const [books, setBooks] = useState(initialBooks);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [fineAmount, setFineAmount] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [restockAmount, setRestockAmount] = useState(0);
  const [supplier, setSupplier] = useState("");
  const [notification, setNotification] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [bulkRestockAmount, setBulkRestockAmount] = useState(10);
  const [bulkSupplier, setBulkSupplier] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [globalThreshold, setGlobalThreshold] = useState(10);
  const [newBook, setNewBook] = useState({
    title: "", author: "", category: "", stock: 0, threshold: 10, price: 0, supplier: ""
  });
  const [editBook, setEditBook] = useState({});

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        checkCriticalStock();
      }, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [books, autoRefresh, refreshInterval]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('alertsBooks');
    const savedSettings = localStorage.getItem('alertsSettings');
    
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (error) {
        console.error('Error loading saved books:', error);
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAutoRefresh(settings.autoRefresh ?? true);
        setRefreshInterval(settings.refreshInterval ?? 30);
        setGlobalThreshold(settings.globalThreshold ?? 10);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem('alertsBooks', JSON.stringify(books));
  }, [books]);

  const checkCriticalStock = () => {
    const criticalBooks = books.filter(book => getStatus(book.stock, book.threshold) === "critical");
    const outOfStockBooks = books.filter(book => getStatus(book.stock, book.threshold) === "out-of-stock");
    
    if (outOfStockBooks.length > 0) {
      setNotification(`🚨 ${outOfStockBooks.length} book(s) are out of stock!`);
      setTimeout(() => setNotification(""), 5000);
    } else if (criticalBooks.length > 0) {
      setNotification(`⚠️ ${criticalBooks.length} book(s) are in critical stock level!`);
      setTimeout(() => setNotification(""), 5000);
    }
  };

  const getStatus = (stock, threshold) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= threshold / 3) return "critical";
    if (stock <= threshold / 2) return "very-low";
    if (stock <= threshold) return "low";
    return "safe";
  };

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const openRestockModal = (book) => {
    setSelectedBook(book);
    setRestockAmount(Math.max(book.threshold - book.stock, 1));
    setSupplier(book.supplier || "");
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditBook({...book});
    setShowEditModal(true);
  };

  const openBulkRestockModal = () => {
    const lowStockBooks = books.filter(book => getStatus(book.stock, book.threshold) !== "safe");
    if (lowStockBooks.length === 0) {
      showNotification("ℹ️ No books need restocking!", "info");
      return;
    }
    setBulkRestockAmount(10);
    setBulkSupplier("");
    setShowBulkModal(true);
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(restockAmount);
    
    if (amount <= 0) {
      showNotification("⚠️ Restock amount must be greater than 0!", "warning");
      return;
    }

    const updatedBooks = books.map((book) =>
      book.id === selectedBook.id
        ? { 
            ...book, 
            stock: book.stock + amount,
            lastRestocked: new Date().toISOString().split('T')[0],
            supplier: supplier.trim()
          }
        : book
    );
    
    setBooks(updatedBooks);
    setShowModal(false);
    showNotification(`✅ "${selectedBook.title}" restocked with ${amount} units from ${supplier}!`);
  };

  const handleBulkRestock = (e) => {
    e.preventDefault();
    const amount = parseInt(bulkRestockAmount);
    
    if (amount <= 0) {
      showNotification("⚠️ Bulk restock amount must be greater than 0!", "warning");
      return;
    }

    const lowStockBooks = books.filter(book => getStatus(book.stock, book.threshold) !== "safe");
    
    const updatedBooks = books.map((book) => {
      const status = getStatus(book.stock, book.threshold);
      if (status !== "safe") {
        return {
          ...book,
          stock: book.stock + amount,
          lastRestocked: new Date().toISOString().split('T')[0],
          supplier: bulkSupplier.trim()
        };
      }
      return book;
    });
    
    setBooks(updatedBooks);
    setShowBulkModal(false);
    showNotification(`🔄 Bulk restocked ${lowStockBooks.length} books with ${amount} units each!`);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.category.trim()) {
      showNotification("⚠️ Please fill in all required fields!", "warning");
      return;
    }

    const stock = parseInt(newBook.stock);
    const threshold = parseInt(newBook.threshold);
    const price = parseFloat(newBook.price);

    if (stock < 0 || threshold <= 0 || price < 0) {
      showNotification("⚠️ Please enter valid numbers for stock, threshold, and price!", "warning");
      return;
    }

    const bookToAdd = {
      ...newBook,
      id: Math.max(...books.map(b => b.id), 0) + 1,
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      category: newBook.category.trim(),
      supplier: newBook.supplier.trim(),
      stock,
      threshold,
      price,
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    
    setBooks([...books, bookToAdd]);
    setNewBook({ title: "", author: "", category: "", stock: 0, threshold: globalThreshold, price: 0, supplier: "" });
    setShowAddModal(false);
    showNotification(`📚 "${bookToAdd.title}" added successfully!`);
  };

  const handleEditBook = (e) => {
    e.preventDefault();
    
    // Validation
    if (!editBook.title.trim() || !editBook.author.trim() || !editBook.category.trim()) {
      showNotification("⚠️ Please fill in all required fields!", "warning");
      return;
    }

    const stock = parseInt(editBook.stock);
    const threshold = parseInt(editBook.threshold);
    const price = parseFloat(editBook.price);

    if (stock < 0 || threshold <= 0 || price < 0) {
      showNotification("⚠️ Please enter valid numbers for stock, threshold, and price!", "warning");
      return;
    }

    const updatedBooks = books.map((book) =>
      book.id === editBook.id
        ? { 
            ...editBook,
            title: editBook.title.trim(),
            author: editBook.author.trim(),
            category: editBook.category.trim(),
            supplier: editBook.supplier?.trim() || "",
            stock,
            threshold,
            price
          }
        : book
    );
    
    setBooks(updatedBooks);
    setShowEditModal(false);
    showNotification(`📝 "${editBook.title}" updated successfully!`);
  };

  const deleteBook = (bookId) => {
    const bookToDelete = books.find(book => book.id === bookId);
    if (window.confirm(`Are you sure you want to delete "${bookToDelete.title}"?\n\nThis action cannot be undone.`)) {
      setBooks(books.filter(book => book.id !== bookId));
      showNotification(`🗑️ "${bookToDelete.title}" deleted successfully!`);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("title");
    setSortOrder("asc");
    setSearchField("title");
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.books && Array.isArray(importedData.books)) {
          if (window.confirm("Are you sure you want to import this data?\n\nThis will replace all current books.")) {
            setBooks(importedData.books);
            showNotification("📥 Data imported successfully!");
          }
        } else {
          showNotification("⚠️ Invalid file format!", "warning");
        }
      } catch (error) {
        showNotification("❌ Error importing data. Please check file format.", "warning");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // Enhanced filtering and sorting
  const processedBooks = books
    .filter((book) => {
      const status = getStatus(book.stock, book.threshold);
      const statusMatch = statusFilter === "all" || status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      
      if (!query) return statusMatch;
      
      let searchMatch = true;
      switch (searchField) {
        case "title": searchMatch = book.title.toLowerCase().includes(query); break;
        case "author": searchMatch = book.author.toLowerCase().includes(query); break;
        case "category": searchMatch = book.category.toLowerCase().includes(query); break;
        case "stock": searchMatch = book.stock.toString().includes(query); break;
        case "status": searchMatch = status.includes(query); break;
        case "supplier": searchMatch = book.supplier?.toLowerCase().includes(query) || false; break;
        default: 
          // Global search across all fields
          searchMatch = book.title.toLowerCase().includes(query) ||
                       book.author.toLowerCase().includes(query) ||
                       book.category.toLowerCase().includes(query) ||
                       book.supplier?.toLowerCase().includes(query) ||
                       status.includes(query);
      }
      
      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "stock": aVal = a.stock; bVal = b.stock; break;
        case "threshold": aVal = a.threshold; bVal = b.threshold; break;
        case "price": aVal = a.price; bVal = b.price; break;
        case "status": 
          const statusOrder = {"out-of-stock": 0, "critical": 1, "very-low": 2, "low": 3, "safe": 4};
          aVal = statusOrder[getStatus(a.stock, a.threshold)]; 
          bVal = statusOrder[getStatus(b.stock, b.threshold)]; 
          break;
        case "lastRestocked": 
          aVal = new Date(a.lastRestocked); 
          bVal = new Date(b.lastRestocked); 
          break;
        case "value":
          aVal = a.stock * a.price;
          bVal = b.stock * b.price;
          break;
        default: 
          aVal = a[sortBy]?.toString().toLowerCase() || ""; 
          bVal = b[sortBy]?.toString().toLowerCase() || "";
      }
      
      if (typeof aVal === 'string') {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

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

    // Fine Management Functions
  const calculateFine = (borrowDate, returnDate, finePerDay) => {
    const borrowDateTime = new Date(borrowDate).getTime();
    const returnDateTime = new Date(returnDate).getTime();
    const diffTime = returnDateTime - borrowDateTime;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays * finePerDay);
  };

  const handleBorrowBook = (bookId, borrower) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          stock: book.stock - 1,
          borrowedCopies: [...book.borrowedCopies, {
            borrowerId: borrower.id,
            borrowerName: borrower.name,
            borrowDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + (book.maxBorrowDays * 24 * 60 * 60 * 1000)).toISOString(),
            returned: false
          }]
        };
      }
      return book;
    }));
    showNotification(`Book borrowed by ${borrower.name}`);
  };

  const handleReturnBook = (bookId, borrowerId) => {
    const book = books.find(b => b.id === bookId);
    const borrowedCopy = book.borrowedCopies.find(copy => 
      copy.borrowerId === borrowerId && !copy.returned
    );

    if (!borrowedCopy) return;

    const fine = calculateFine(
      borrowedCopy.borrowDate,
      new Date().toISOString(),
      book.finePerDay
    );

    if (fine > 0) {
      setSelectedBorrower({ ...borrowedCopy, fine, bookId });
      setFineAmount(fine);
      setShowFineModal(true);
    } else {
      completeReturn(bookId, borrowerId);
    }
  };

  const completeReturn = (bookId, borrowerId) => {
    setBooks(prevBooks => prevBooks.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          stock: book.stock + 1,
          borrowedCopies: book.borrowedCopies.map(copy => {
            if (copy.borrowerId === borrowerId && !copy.returned) {
              return { ...copy, returned: true, returnDate: new Date().toISOString() };
            }
            return copy;
          })
        };
      }
      return book;
    }));
  };

  const handleFinePayment = () => {
    completeReturn(selectedBorrower.bookId, selectedBorrower.borrowerId);
    showNotification(`Fine of Rs ${fineAmount} collected from ${selectedBorrower.borrowerName}`);
    setShowFineModal(false);
    setSelectedBorrower(null);
    setFineAmount(0);
  };

  const downloadReport = () => {
    const reportData = processedBooks.map(book => ({
      title: book.title,
      author: book.author,
      category: book.category,
      stock: book.stock,
      threshold: book.threshold,
      status: getStatus(book.stock, book.threshold),
      value: `$${(book.stock * book.price).toFixed(2)}`,
      unitPrice: `$${book.price}`,
      supplier: book.supplier,
      lastRestocked: book.lastRestocked
    }));

    let reportText = "COMPREHENSIVE INVENTORY REPORT\n";
    reportText += "=".repeat(80) + "\n\n";
    reportText += `Generated on: ${new Date().toLocaleString()}\n`;
    reportText += `Report covers: ${reportData.length} books\n\n`;
    
    reportText += "EXECUTIVE SUMMARY:\n";
    reportText += "-".repeat(40) + "\n";
    reportText += `Total Books in Inventory: ${books.length}\n`;
    reportText += `Total Stock Units: ${getTotalStock()}\n`;
    reportText += `Total Inventory Value: $${getTotalValue()}\n`;
    reportText += `Average Price per Book: $${getAveragePrice()}\n`;
    reportText += `Out of Stock Items: ${getOutOfStockCount()}\n`;
    reportText += `Critical Stock Items: ${getCriticalCount()}\n`;
    reportText += `Low Stock Items: ${getLowStockCount()}\n\n`;
    
    reportText += "STATUS BREAKDOWN:\n";
    reportText += "-".repeat(40) + "\n";
    const statusCounts = {};
    reportData.forEach(book => {
      statusCounts[book.status] = (statusCounts[book.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      reportText += `${status.toUpperCase().replace("-", " ")}: ${count} books\n`;
    });
    reportText += "\n";
    
    reportText += "CATEGORY ANALYSIS:\n";
    reportText += "-".repeat(40) + "\n";
    const categoryStats = {};
    books.forEach(book => {
      if (!categoryStats[book.category]) {
        categoryStats[book.category] = { count: 0, value: 0 };
      }
      categoryStats[book.category].count++;
      categoryStats[book.category].value += book.stock * book.price;
    });
    Object.entries(categoryStats).forEach(([category, stats]) => {
      reportText += `${category}: ${stats.count} books, $${stats.value.toFixed(2)} value\n`;
    });
    reportText += "\n";
    
    reportText += "DETAILED INVENTORY:\n";
    reportText += "-".repeat(80) + "\n";
    
    reportData.forEach((book, index) => {
      reportText += `${index + 1}. ${book.title}\n`;
      reportText += `   Author: ${book.author}\n`;
      reportText += `   Category: ${book.category}\n`;
      reportText += `   Stock: ${book.stock}/${book.threshold} units\n`;
      reportText += `   Status: ${book.status.toUpperCase().replace("-", " ")}\n`;
      reportText += `   Unit Price: ${book.unitPrice}\n`;
      reportText += `   Total Value: ${book.value}\n`;
      reportText += `   Supplier: ${book.supplier}\n`;
      reportText += `   Last Restocked: ${new Date(book.lastRestocked).toLocaleDateString()}\n`;
      reportText += `   Days Since Restock: ${Math.floor((new Date() - new Date(book.lastRestocked)) / (1000 * 60 * 60 * 24))}\n\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive_inventory_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification("📄 Comprehensive report exported successfully!");
  };

  return (
    <div className="alerts-page">
      {notification && (
        <div className={`notification ${notification.includes("⚠️") || notification.includes("🚨") || notification.includes("❌") ? "warning" : "success"}`}>
          {notification}
        </div>
      )}

      <div className="alerts-container">
        {/* Header with Stats */}
        <header className="alerts-header">
          <h1>📚 Advanced Alerts Management System</h1>
          <p>Comprehensive inventory monitoring, alerts, and automated management</p>
          
          <div className="stats-container">
            <div className="stat-card critical">
              <div className="stat-number">{getOutOfStockCount()}</div>
              <div className="stat-label">Out of Stock</div>
            </div>
            <div className="stat-card critical">
              <div className="stat-number">{getCriticalCount()}</div>
              <div className="stat-label">Critical Items</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-number">{getLowStockCount()}</div>
              <div className="stat-label">Low Stock Items</div>
            </div>
            <div className="stat-card info">
              <div className="stat-number">{books.length}</div>
              <div className="stat-label">Total Books</div>
            </div>
            <div className="stat-card success">
              <div className="stat-number">${getTotalValue()}</div>
              <div className="stat-label">Inventory Value</div>
            </div>
            <div className="stat-card info">
              <div className="stat-number">{getTotalStock()}</div>
              <div className="stat-label">Total Units</div>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="controls-container">
          <div className="search-controls">
            <select
              className="control-select"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="category">Category</option>
              <option value="stock">Stock</option>
              <option value="status">Status</option>
              <option value="supplier">Supplier</option>
            </select>

            <input
              type="text"
              className="search-input"
              placeholder={`Search by ${searchField}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="control-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="critical">Critical</option>
              <option value="low">Low</option>
              <option value="safe">Safe</option>
            </select>

            <button className="btn btn-outline" onClick={clearAllFilters}>
              🔄 Clear Filters
            </button>
          </div>

          <div className="action-controls">
            <select
              className="control-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="stock">Sort by Stock</option>
              <option value="threshold">Sort by Threshold</option>
              <option value="status">Sort by Status</option>
              <option value="price">Sort by Price</option>
              <option value="value">Sort by Value</option>
              <option value="lastRestocked">Sort by Last Restocked</option>
            </select>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
              ➕ Add Book
            </button>

            <button className="btn btn-primary" onClick={openBulkRestockModal}>
              🔄 Bulk Restock
            </button>

            <button className="btn btn-info" onClick={downloadReport}>
              📄 Export Report
            </button>
          </div>
        </div>

        {/* Results Count and Status */}
        <div className="results-info">
          Showing {processedBooks.length} of {books.length} books
          {searchQuery && ` (filtered by "${searchQuery}")`}
          {statusFilter !== "all" && ` (${statusFilter.replace("-", " ")} status)`}
          {autoRefresh && <span className="auto-refresh-indicator">🔄 Auto-refresh: ON</span>}
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Book Details</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Borrowed Copies</th>
                <th>Value</th>
                <th>Last Restocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedBooks.map((book) => {
                const status = getStatus(book.stock, book.threshold);
                const stockPercentage = book.threshold > 0 ? Math.min((book.stock / book.threshold) * 100, 100) : 0;
                const daysSinceRestock = Math.floor((new Date() - new Date(book.lastRestocked)) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={book.id} className={`row-${status}`}>
                    <td className="book-details">
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">by {book.author}</div>
                      <div className="book-category">{book.category}</div>
                    </td>
                    <td className="stock-level">
                      <div className="stock-numbers">
                        <strong className={status === "out-of-stock" ? "text-danger" : ""}>
                          {book.stock}
                        </strong> / {book.threshold}
                      </div>
                      <div className="stock-bar">
                        <div 
                          className={`stock-fill stock-fill-${status}`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                      <div className="stock-percentage">
                        {stockPercentage.toFixed(0)}%
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${status}`}>
                        {status.replace("-", " ").toUpperCase()}
                        {status === "out-of-stock" && " ⚠️"}
                      </span>
                    </td>
                    <td className="value-cell">
                      <div className="total-value">${(book.stock * book.price).toFixed(2)}</div>
                      <div className="unit-price">${book.price} each</div>
                    </td>
                    <td className="restock-info">
                      <div className="restock-date">
                        {new Date(book.lastRestocked).toLocaleDateString()}
                      </div>
                      {book.supplier && (
                        <div className="supplier-name">{book.supplier}</div>
                      )}
                      <div className="days-ago">
                        {daysSinceRestock} days ago
                      </div>
                    </td>
                    <td className="borrowed-copies">
                      {book.borrowedCopies.filter(copy => !copy.returned).map(copy => (
                        <div key={`${copy.borrowerId}-${copy.borrowDate}`} className="borrowed-copy">
                          <div>{copy.borrowerName}</div>
                          <div className="borrow-dates">
                            <small>Borrowed: {new Date(copy.borrowDate).toLocaleDateString()}</small>
                            <small>Due: {new Date(copy.dueDate).toLocaleDateString()}</small>
                          </div>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReturnBook(book.id, copy.borrowerId)}
                          >
                            Return
                          </button>
                        </div>
                      ))}
                      {book.stock > 0 && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleBorrowBook(book.id, { 
                            id: 'user-' + Date.now(), 
                            name: prompt('Enter borrower name:') 
                          })}
                        >
                          Borrow
                        </button>
                      )}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {status !== "safe" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => openRestockModal(book)}
                            title="Restock"
                          >
                            ⚡
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => openEditModal(book)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteBook(book.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {processedBooks.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">📚</div>
            <div className="no-results-text">
              No books found matching your criteria.
            </div>
            <button className="btn btn-outline" onClick={clearAllFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Restock "{selectedBook?.title}"</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleRestockSubmit}>
              <div className="form-group">
                <label>Current Stock:</label>
                <div className="current-stock-display">
                  {selectedBook?.stock} units
                  <span className={`status-badge status-${getStatus(selectedBook?.stock, selectedBook?.threshold)}`}>
                    {getStatus(selectedBook?.stock, selectedBook?.threshold).replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Restock Amount:</label>
                <input
                  type="number"
                  value={restockAmount}
                  min="1"
                  max="1000"
                  onChange={(e) => setRestockAmount(e.target.value)}
                  required
                />
                <small>New total will be: {selectedBook?.stock + parseInt(restockAmount || 0)} units</small>
              </div>

              <div className="form-group">
                <label>Supplier:</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Supplier name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Cost:</label>
                <div className="cost-display">
                  ${((restockAmount || 0) * (selectedBook?.price || 0)).toFixed(2)}
                </div>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-success">Confirm Restock</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Restock Modal */}
      {showBulkModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Bulk Restock Low Stock Items</h2>
              <button className="close-btn" onClick={() => setShowBulkModal(false)}>×</button>
            </div>
            <form onSubmit={handleBulkRestock}>
              <div className="bulk-info">
                <p>This will restock all items that are not in "Safe" status.</p>
                <p><strong>Items to be restocked:</strong> {books.filter(book => getStatus(book.stock, book.threshold) !== "safe").length}</p>
                <div className="bulk-preview">
                  {books.filter(book => getStatus(book.stock, book.threshold) !== "safe").slice(0, 5).map(book => (
                    <div key={book.id} className="bulk-item">
                      • {book.title} (Current: {book.stock})
                    </div>
                  ))}
                  {books.filter(book => getStatus(book.stock, book.threshold) !== "safe").length > 5 && (
                    <div className="bulk-item">
                      ... and {books.filter(book => getStatus(book.stock, book.threshold) !== "safe").length - 5} more
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Restock Amount (per book):</label>
                <input
                  type="number"
                  value={bulkRestockAmount}
                  min="1"
                  max="100"
                  onChange={(e) => setBulkRestockAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Supplier:</label>
                <input
                  type="text"
                  value={bulkSupplier}
                  onChange={(e) => setBulkSupplier(e.target.value)}
                  placeholder="Supplier name for all items"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Total Cost:</label>
                <div className="cost-display">
                  ${books.filter(book => getStatus(book.stock, book.threshold) !== "safe")
                    .reduce((total, book) => total + (book.price * (bulkRestockAmount || 0)), 0).toFixed(2)}
                </div>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-success">Confirm Bulk Restock</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddBook}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Title: *</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    placeholder="Enter book title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author: *</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    placeholder="Enter author name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category: *</label>
                  <input
                    type="text"
                    value={newBook.category}
                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                    placeholder="e.g., Computer Science, Business"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Current Stock:</label>
                  <input
                    type="number"
                    value={newBook.stock}
                    onChange={(e) => setNewBook({...newBook, stock: e.target.value})}
                    min="0"
                    max="9999"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Threshold:</label>
                  <input
                    type="number"
                    value={newBook.threshold}
                    onChange={(e) => setNewBook({...newBook, threshold: e.target.value})}
                    min="1"
                    max="999"
                    required
                  />
                  <small>Alert when stock falls below this number</small>
                </div>
                <div className="form-group">
                  <label>Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBook.price}
                    onChange={(e) => setNewBook({...newBook, price: e.target.value})}
                    min="0"
                    max="9999.99"
                    required
                  />
                </div>
                <div className="form-group form-group-full">
                  <label>Supplier: *</label>
                  <input
                    type="text"
                    value={newBook.supplier}
                    onChange={(e) => setNewBook({...newBook, supplier: e.target.value})}
                    placeholder="Enter supplier name"
                    required
                  />
                </div>
              </div>

              <div className="form-preview">
                <h4>Preview:</h4>
                <p><strong>Status will be:</strong> 
                  <span className={`status-badge status-${getStatus(parseInt(newBook.stock || 0), parseInt(newBook.threshold || 10))}`}>
                    {getStatus(parseInt(newBook.stock || 0), parseInt(newBook.threshold || 10)).replace("-", " ").toUpperCase()}
                  </span>
                </p>
                <p><strong>Total Value:</strong> ${((newBook.stock || 0) * (newBook.price || 0)).toFixed(2)}</p>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-success">Add Book</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h2>Edit Book</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditBook}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Title: *</label>
                  <input
                    type="text"
                    value={editBook.title || ""}
                    onChange={(e) => setEditBook({...editBook, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author: *</label>
                  <input
                    type="text"
                    value={editBook.author || ""}
                    onChange={(e) => setEditBook({...editBook, author: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category: *</label>
                  <input
                    type="text"
                    value={editBook.category || ""}
                    onChange={(e) => setEditBook({...editBook, category: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Current Stock:</label>
                  <input
                    type="number"
                    value={editBook.stock || 0}
                    onChange={(e) => setEditBook({...editBook, stock: e.target.value})}
                    min="0"
                    max="9999"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Threshold:</label>
                  <input
                    type="number"
                    value={editBook.threshold || 10}
                    onChange={(e) => setEditBook({...editBook, threshold: e.target.value})}
                    min="1"
                    max="999"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editBook.price || 0}
                    onChange={(e) => setEditBook({...editBook, price: e.target.value})}
                    min="0"
                    max="9999.99"
                    required
                  />
                </div>
                <div className="form-group form-group-full">
                  <label>Supplier:</label>
                  <input
                    type="text"
                    value={editBook.supplier || ""}
                    onChange={(e) => setEditBook({...editBook, supplier: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-preview">
                <h4>Current Status:</h4>
                <p><strong>Status:</strong> 
                  <span className={`status-badge status-${getStatus(parseInt(editBook.stock || 0), parseInt(editBook.threshold || 10))}`}>
                    {getStatus(parseInt(editBook.stock || 0), parseInt(editBook.threshold || 10)).replace("-", " ").toUpperCase()}
                  </span>
                </p>
                <p><strong>Total Value:</strong> ${((editBook.stock || 0) * (editBook.price || 0)).toFixed(2)}</p>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-success">Update Book</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fine Modal */}
      {showFineModal && selectedBorrower && (
        <div className="fine-modal">
          <div className="fine-modal-content">
            <h3>Late Return Fine</h3>
            <p>Borrower: {selectedBorrower.borrowerName}</p>
            <p>Fine Amount: Rs {fineAmount}</p>
            <div className="fine-modal-actions">
              <button onClick={handleFinePayment}>
                Collect Fine & Return Book
              </button>
              <button onClick={() => setShowFineModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;