import React, { useState } from "react";
import "./Supplier.css";
import {
  FaSearch,
  FaPlus,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaTruck,
} from "react-icons/fa";

// Backend CRUD API base URL
const API_URL = "http://localhost:5001/suppliers";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
    // Fetch all suppliers from backend
    React.useEffect(() => {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => setSuppliers(data));
    }, []);
    const [filterOpen, setFilterOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editSupplierId, setEditSupplierId] = useState(null);
    const [newSupplier, setNewSupplier] = useState({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      books: "",
      lastUpdated: new Date().toISOString().slice(0, 10),
    });

    // Form handlers
    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setNewSupplier({ ...newSupplier, [name]: value });
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      const payload = {
        ...newSupplier,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
      if (isEditing) {
        await fetch(`${API_URL}/${editSupplierId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      // Refresh suppliers
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => setSuppliers(data));
      setShowForm(false);
      setIsEditing(false);
      setEditSupplierId(null);
      setNewSupplier({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        books: "",
        lastUpdated: new Date().toISOString().slice(0, 10),
      });
    };

    const handleFormCancel = () => {
      setShowForm(false);
      setIsEditing(false);
      setEditSupplierId(null);
      setNewSupplier({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        books: "",
        lastUpdated: new Date().toISOString().slice(0, 10),
      });
    };

    const handleEdit = (supplier) => {
      setIsEditing(true);
      setEditSupplierId(supplier._id);
      setNewSupplier({ ...supplier });
      setShowForm(true);
    };

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        // Refresh suppliers
        fetch(API_URL)
          .then((res) => res.json())
          .then((data) => setSuppliers(data));
      }
    };

    return (
      <>
        {showForm && (
          <div className="modal">
            <div className="modal-backdrop" onClick={handleFormCancel} />
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title gradient-text">{isEditing ? "Edit Supplier" : "Add New Supplier"}</h2>
              </div>
              <form className="supplier-form" onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name" className="form-label">Supplier Name *</label>
                    <input
                      id="name"
                      name="name"
                      value={newSupplier.name}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact" className="form-label">Contact Person *</label>
                    <input
                      id="contact"
                      name="contact"
                      value={newSupplier.contact}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={newSupplier.email}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone" className="form-label">Phone *</label>
                    <input
                      id="phone"
                      name="phone"
                      value={newSupplier.phone}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="address" className="form-label">Address *</label>
                    <input
                      id="address"
                      name="address"
                      value={newSupplier.address}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="books" className="form-label">Books Supplied *</label>
                    <input
                      id="books"
                      name="books"
                      value={newSupplier.books}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={handleFormCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    {isEditing ? "Save Changes" : "Add Supplier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="supplier-container">
          {/* Hero Section */}
          <div className="supplier-hero">
            <div className="supplier-hero-content">
              <FaTruck className="hero-icon" />
              <h1 className="supplier-title gradient-text">Suppliers</h1>
              <p className="supplier-subtitle">
                Manage your book suppliers efficiently in one place
              </p>
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="search-section">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search suppliers..."
                  aria-label="Search suppliers"
                />
              </div>
              <div className="action-buttons">
                <button
                  className={`filter-button ${filterOpen ? "active" : ""}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FaFilter className="button-icon" /> Filters
                </button>
                <button className="add-button" onClick={() => setShowForm(true)}>
                  <FaPlus className="button-icon" /> Add Supplier
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <div className={`filter-panel ${filterOpen ? "show" : ""}`}>
              <select className="filter-select">
                <option value="">Sort by Name</option>
                <option value="date">Sort by Last Updated</option>
              </select>
              <select className="filter-select">
                <option value="">All Categories</option>
                <option value="cs">Computer Science</option>
                <option value="math">Mathematics</option>
                <option value="eng">Engineering</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <div className="header-cell">#</div>
              <div className="header-cell">Supplier Name</div>
              <div className="header-cell">Contact Person</div>
              <div className="header-cell">Email</div>
              <div className="header-cell">Phone</div>
              <div className="header-cell">Address</div>
              <div className="header-cell">Books Supplied</div>
              <div className="header-cell">Last Updated</div>
              <div className="header-cell">Actions</div>
            </div>

            {suppliers.map((supplier, index) => (
              <div className="table-row" key={supplier._id}>
                <div className="table-cell">{index + 1}</div>
                <div className="table-cell supplier-name">{supplier.name}</div>
                <div className="table-cell">{supplier.contact}</div>
                <div className="table-cell">{supplier.email}</div>
                <div className="table-cell">{supplier.phone}</div>
                <div className="table-cell">{supplier.address}</div>
                <div className="table-cell books-supplied">
                  {supplier.books}
                </div>
                <div className="table-cell last-updated">{supplier.lastUpdated}</div>
                <div className="table-cell actions">
                  <button className="action-icon edit-icon" onClick={() => handleEdit(supplier)}>
                    <FaEdit />
                  </button>
                  <button className="action-icon delete-icon" onClick={() => handleDelete(supplier._id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
