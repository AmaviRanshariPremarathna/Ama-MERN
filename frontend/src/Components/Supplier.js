import React, { useState } from "react";
import "./Supplier.css";
import {
  FaSearch,
  FaPlus,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaEllipsisH,
  FaTruck,
} from "react-icons/fa";

const initialSuppliers = [
  {
    id: 1,
    name: "Pearson Publishers",
    contact: "John Doe",
    email: "john@pearson.com",
    phone: "+94 77 123 4567",
    address: "123, High Level Road, Colombo",
    books: "Computer Science, AI, Data Science",
    lastUpdated: "2025-09-01",
  },
  {
    id: 2,
    name: "Oxford Bookstore",
    contact: "Mary Smith",
    email: "mary@oxfordbooks.com",
    phone: "+94 71 987 6543",
    address: "45, Galle Road, Colombo",
    books: "Mathematics, Physics, Engineering",
    lastUpdated: "2025-08-28",
  },
];

export default function Supplier() {
    const [suppliers, setSuppliers] = useState(initialSuppliers);
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

    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (isEditing) {
        setSuppliers(suppliers.map(sup =>
          sup.id === editSupplierId
            ? { ...newSupplier, id: editSupplierId, lastUpdated: new Date().toISOString().slice(0, 10) }
            : sup
        ));
      } else {
        setSuppliers([
          ...suppliers,
          {
            ...newSupplier,
            id: suppliers.length + 1,
            lastUpdated: new Date().toISOString().slice(0, 10),
          },
        ]);
      }
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
      setEditSupplierId(supplier.id);
      setNewSupplier({ ...supplier });
      setShowForm(true);
    };

    const handleDelete = (id) => {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
        setSuppliers(suppliers.filter(sup => sup.id !== id));
      }
    };

    return (
      <>
        {showForm && (
          <div className="modal">
            <div className="modal-backdrop" onClick={handleFormCancel} />
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title gradient-text">Add New Supplier</h2>
              </div>
              <form className="supplier-form" onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <input
                    name="name"
                    placeholder="Supplier Name"
                    value={newSupplier.name}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                  <input
                    name="contact"
                    placeholder="Contact Person"
                    value={newSupplier.contact}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={newSupplier.email}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={newSupplier.phone}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                  <input
                    name="address"
                    placeholder="Address"
                    value={newSupplier.address}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                  <input
                    name="books"
                    placeholder="Books Supplied (comma separated)"
                    value={newSupplier.books}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={handleFormCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Add Supplier
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
              <div className="table-row" key={supplier.id}>
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
                  <button className="action-icon delete-icon" onClick={() => handleDelete(supplier.id)}>
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
