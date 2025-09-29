import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TicketDashboard from './components/HelpDesk/user/TicketDashboard';
import AdminStats from './components/HelpDesk/admin/AdminStats';
import AdminTicketList from './components/HelpDesk/admin/AdminTicketList';
import AdminTicketDetail from './components/HelpDesk/admin/AdminTicketDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          <Route path="/helpdesk" element={<TicketDashboard />} />
          {/* Add routes */}
          <Route path="/admin/tickets" element={<AdminTicketList />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin" element={<AdminTicketList />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
