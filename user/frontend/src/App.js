import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/User/User/HomePage';
import Register from './components/User/Register';
import Login from './components/User/Login';
import Profile from './components/User/Profile';
// Add imports
import AdminUsers from './components/User/Admin/AdminUsers';
import AdminUserDetail from './components/User/Admin/AdminUserDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add routes */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
