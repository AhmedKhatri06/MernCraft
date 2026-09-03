import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ quotes: [], leads: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/dashboard-data`, {
          credentials: 'include'
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container container section-padding">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage your inquiries, quotations, and active project requests.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        <div className="dashboard-card">
          <h3>Your Profile</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Account Status:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Active Verified</span></p>
        </div>

        <div className="dashboard-card">
          <h3>Your Quotations</h3>
          {loading ? (
            <p>Loading quotations...</p>
          ) : data.quotes.length === 0 ? (
            <>
              <p>You have no pending quotes. Submit a project inquiry to receive a detailed estimate.</p>
              <button className="dashboard-action-btn" onClick={() => navigate('/contact')}>Request a Quote</button>
            </>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {data.quotes.map(q => (
                <li key={q._id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <strong>{q.title || 'Quotation'}</strong>
                  <br />
                  <span>Amount: ₹{q.total || q.amount} | Status: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{q.status}</span></span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Inquiries Submitted</h3>
          {loading ? (
            <p>Loading inquiries...</p>
          ) : data.leads.length === 0 ? (
            <p>No contact inquiries submitted with this email yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {data.leads.map(l => (
                <li key={l._id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <strong>{l.projectType}</strong>
                  <br />
                  <small style={{ color: 'var(--text-secondary)' }}>Status: {l.status} | Date: {new Date(l.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
