import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BookList from './components/Order/User/BookList';
import MyOrders from './components/Order/User/MyOrders';
import OrderDetail from './components/Order/User/OrderDetail';
import AdminOrders from './components/Order/Admin/AdminOrders';
import AdminOrderDetail from './components/Order/Admin/AdminOrderDetail';
// Add imports

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          
          <Route path="/books" element={<BookList />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          {/* Add routes */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
