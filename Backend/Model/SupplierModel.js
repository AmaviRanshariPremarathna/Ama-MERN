const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  books: { type: String, required: true },
  lastUpdated: { type: String, required: true },
});

module.exports = mongoose.model('Supplier', SupplierSchema);