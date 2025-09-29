const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  stockCurrent: { type: Number, required: true },
  stockTotal: { type: Number, required: true },
  status: { type: String, required: true },
  supplier: { type: String, required: true },
  lastUpdated: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);