import React, { useState } from "react";
import "./Product.css";
import {
  FaBook,
  FaPencilAlt,
  FaTrashAlt,
  FaSort,
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

// Backend CRUD API base URL
const API_URL = "http://localhost:5000/products";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    stockCurrent: "",
    stockTotal: "",
    status: "",
    supplier: "",
  });

  // Fetch all products from backend
  React.useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Add icon and color fields for UI
        setProducts(
          data.map((p) => ({
            ...p,
            icon: <FaBook />,
            stockColor:
              p.stockCurrent / p.stockTotal > 0.5
                ? "#3b82f6"
                : p.stockCurrent > 0
                ? "#f59e0b"
                : "#6b7280",
            statusColor:
              p.status === "IN STOCK"
                ? "#22c55e"
                : p.status === "LOW STOCK"
                ? "#f59e0b"
                : "#ef4444",
          }))
        );
      });
  }, []);

  // Default options for dropdowns
  const defaultCategories = [
    "Information Technology",
    "Computer Science",
    "Cyber Security",
    "Mathematics",
    "Engineering",
    "Literature",
    "Other"
  ];
  const defaultStatuses = [
    "IN STOCK",
    "LOW STOCK",
    "OUT OF STOCK"
  ];
  const defaultSuppliers = [
    "MIT Press",
    "Pearson",
    "McGraw-Hill",
    "Oxford",
    "Other"
  ];

  // Merge product values with defaults for dropdowns
  const categories = [
    "All Categories",
    ...Array.from(new Set([...defaultCategories, ...products.map((p) => p.category).filter(Boolean)])),
  ];
  const statuses = [
    "All Status",
    ...Array.from(new Set([...defaultStatuses, ...products.map((p) => p.status).filter(Boolean)])),
  ];
  const suppliers = [
    "All Suppliers",
    ...Array.from(new Set([...defaultSuppliers, ...products.map((p) => p.supplier).filter(Boolean)])),
  ];

  const filteredProducts = products.filter((p) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(lowerSearch) ||
      p.code.toLowerCase().includes(lowerSearch) ||
      p.category.toLowerCase().includes(lowerSearch) ||
      p.supplier.toLowerCase().includes(lowerSearch);
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Status" || p.status === selectedStatus;
    const matchesSupplier = selectedSupplier === "All Suppliers" || p.supplier === selectedSupplier;
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  // -------------------------------
  // Form Handlers
  // -------------------------------
  const handleAddButton = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewProduct({
      name: "",
      code: "",
      category: "",
      price: "",
      stockCurrent: "",
      stockTotal: "",
      status: "",
      supplier: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const stockCurrent = parseInt(newProduct.stockCurrent);
    const stockTotal = parseInt(newProduct.stockTotal);
    const statusText = newProduct.status.toUpperCase();
    const payload = {
      ...newProduct,
      stockCurrent,
      stockTotal,
      status: statusText,
      lastUpdated: new Date().toLocaleString(),
    };
    if (isEditing) {
      // Update product
      await fetch(`${API_URL}/${editProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Add product
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    // Refresh products
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(
          data.map((p) => ({
            ...p,
            icon: <FaBook />,
            stockColor:
              p.stockCurrent / p.stockTotal > 0.5
                ? "#3b82f6"
                : p.stockCurrent > 0
                ? "#f59e0b"
                : "#6b7280",
            statusColor:
              p.status === "IN STOCK"
                ? "#22c55e"
                : p.status === "LOW STOCK"
                ? "#f59e0b"
                : "#ef4444",
          }))
        );
      });
    setShowForm(false);
    setNewProduct({
      name: "",
      code: "",
      category: "",
      price: "",
      stockCurrent: "",
      stockTotal: "",
      status: "",
      supplier: "",
    });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setNewProduct({
      name: "",
      code: "",
      category: "",
      price: "",
      stockCurrent: "",
      stockTotal: "",
      status: "",
      supplier: "",
    });
  };

  // -------------------------------
  // Action Handlers
  // -------------------------------
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setNewProduct({
      name: product.name,
      code: product.code,
      category: product.category,
      price: product.price,
      stockCurrent: product.stockCurrent,
      stockTotal: product.stockTotal,
      status: product.status,
      supplier: product.supplier,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      // Refresh products
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          setProducts(
            data.map((p) => ({
              ...p,
              icon: <FaBook />,
              stockColor:
                p.stockCurrent / p.stockTotal > 0.5
                  ? "#3b82f6"
                  : p.stockCurrent > 0
                  ? "#f59e0b"
                  : "#6b7280",
              statusColor:
                p.status === "IN STOCK"
                  ? "#22c55e"
                  : p.status === "LOW STOCK"
                  ? "#f59e0b"
                  : "#ef4444",
            }))
          );
        });
    }
  };

  return (
    <div className="product-container" style={{ marginLeft: '240px' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Inventory Management</h1>
          <p className="hero-subtitle">
            Seamlessly manage your inventory with intelligent tracking and real-time insights
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search books, categories, suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="action-buttons">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-button ${showFilters ? 'active' : ''}`}
            >
              <FaFilter className="button-icon" />
              Filters
            </button>
            <button onClick={handleAddButton} className="add-button">
              <FaPlus className="button-icon" />
              Add Book
            </button>
          </div>
        </div>

        {/* Animated Filter Panel */}
        <div className={`filter-panel${showFilters ? ' show' : ''}`}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="filter-select"
          >
            {suppliers.map((sup) => (
              <option key={sup} value={sup}>{sup}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modern Card-Based Table */}
      <div className="table-container">
        <div className="table-header">
          <div className="header-cell">
            <input type="checkbox" className="checkbox" />
          </div>
          <div className="header-cell">PRODUCT</div>
          <div className="header-cell">
            CATEGORY <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">
            PRICE <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">
            STOCK <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">
            STATUS <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">SUPPLIER</div>
          <div className="header-cell">
            LAST UPDATED <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">ACTIONS</div>
        </div>

        {filteredProducts.map((product, index) => (
          <div
            key={product._id || product.id}
            className="table-row"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="table-cell">
              <input type="checkbox" className="checkbox" />
            </div>
            
            <div className="table-cell">
              <div className="product-info">
                <div className="product-icon">{product.icon}</div>
                <div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-code">{product.code}</div>
                </div>
              </div>
            </div>

            <div className="table-cell">
              <span className="category-pill">{product.category}</span>
            </div>

            <div className="table-cell">
              <span className="price">{product.price}</span>
            </div>

            <div className="table-cell">
              <div className="stock-info">
                <div className="stock-text">
                  {product.stockCurrent} / {product.stockTotal}
                </div>
                <div className="stock-bar">
                  <div
                    className="stock-progress"
                    style={{
                      width: `${(product.stockCurrent / product.stockTotal) * 100}%`,
                      backgroundColor: product.stockColor
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="table-cell">
              <span
                className="status-pill"
                style={{ backgroundColor: product.statusColor }}
              >
                {product.status}
              </span>
            </div>

            <div className="table-cell">
              <span className="supplier">{product.supplier}</span>
            </div>

            <div className="table-cell">
              <span className="last-updated">{product.lastUpdated}</span>
            </div>

            <div className="table-cell">
              <div className="actions">
                <div
                  className="action-icon edit-icon"
                  onClick={() => handleEdit(product)}
                >
                  <FaPencilAlt />
                </div>
                <div
                  className="action-icon delete-icon"
                  onClick={() => handleDelete(product._id || product.id)}
                >
                  <FaTrashAlt />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-backdrop" onClick={handleFormCancel} />
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditing ? "Edit Book" : "Add New Book"}
              </h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className="product-form">
              <div className="form-grid">
                <input
                  name="name"
                  placeholder="Book Name"
                  value={newProduct.name}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
                <input
                  name="code"
                  placeholder="Product Code"
                  value={newProduct.code}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c !== "All Categories").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  name="price"
                  placeholder="Price (e.g., $49.99)"
                  value={newProduct.price}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
                <input
                  name="stockCurrent"
                  type="number"
                  placeholder="Current Stock"
                  value={newProduct.stockCurrent}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
                <input
                  name="stockTotal"
                  type="number"
                  placeholder="Total Stock"
                  value={newProduct.stockTotal}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
                <select
                  name="status"
                  value={newProduct.status}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Status</option>
                  {statuses.filter(s => s !== "All Status").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  name="supplier"
                  value={newProduct.supplier}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.filter(s => s !== "All Suppliers").map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditing ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;