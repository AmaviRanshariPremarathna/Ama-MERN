const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = 5000;

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://hasira:hasira2002@hasira.3fidqtc.mongodb.net/';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Import routes
const UserRoute = require('./routes/UserRoute');
// Routes
app.use("/users",UserRoute);



// Root route
app.get('/', (req, res) => {
  res.send('Helpdesk Management System API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };