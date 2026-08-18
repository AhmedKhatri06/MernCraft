import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container container section-padding">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Your Profile</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        <div className="dashboard-card">
          <h3>Your Projects</h3>
          <p>You have no active projects currently. Submit a quote to get started!</p>
          <button className="dashboard-action-btn" onClick={() => navigate('/contact')}>Start a Project</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
