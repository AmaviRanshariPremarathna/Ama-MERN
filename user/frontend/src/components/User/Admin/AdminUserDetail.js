import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './AdminUsers.css';

const AdminUserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [err, setErr] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setErr('');
      try {
        const res = await fetch(`http://localhost:5000/users/${id}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setErr(data.message || 'User not found');
        }
      } catch {
        setErr('User not found');
      }
    };
    fetchUser();
  }, [id]);

  if (err) return (
    <div className="admin-users-bg">
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>

        <div className="admin-users-container" style={{ flex: 1 }}>
          <div className="admin-users-error">{err}</div>
          <button onClick={() => navigate('/admin/users')}>Back</button>
        </div>
      </div>
      
    </div>
  );

  if (!user) return null;

  return (
    <div className="admin-users-bg">
      
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        
        <div className="admin-users-container" style={{ flex: 1 }}>
          <h2>User Details</h2>
          <table className="admin-users-detail-table">
            <tbody>
              <tr><td>Name:</td><td>{user.full_name}</td></tr>
              <tr><td>Email:</td><td>{user.email}</td></tr>
              <tr><td>University ID:</td><td>{user.uni_id}</td></tr>
              <tr><td>Role:</td><td>{user.role}</td></tr>
              <tr><td>Contact:</td><td>{user.contact_no}</td></tr>
              <tr><td>Faculty:</td><td>{user.faculty}</td></tr>
            </tbody>
          </table>
          <button className="admin-users-back-btn" onClick={() => navigate('/admin/users')}>Back to Users</button>
        </div>
      </div>
      
    </div>
  );
};

export default AdminUserDetail;