import React, { useEffect, useState } from 'react';
import dashboardService from '../../../services/dashboardService';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getStats();
        if (data.success) {
          setStatsData(data.data);
        }
      } catch (err) {
        setError(err.message || 'Network error while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <div className="admin-error">{error}</div>;
  if (!statsData) return null;

  const { stats, recent } = statsData;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats.users}</div>
        </div>
        <div className="stat-card">
          <h3>Total Leads</h3>
          <div className="stat-value">{stats.leads}</div>
        </div>
        <div className="stat-card">
          <h3>New Leads</h3>
          <div className="stat-value" style={{color: 'var(--mc-green)'}}>{stats.newLeads}</div>
        </div>
        <div className="stat-card">
          <h3>Projects</h3>
          <div className="stat-value">{stats.projects}</div>
        </div>
        <div className="stat-card">
          <h3>Services</h3>
          <div className="stat-value">{stats.services}</div>
        </div>
        <div className="stat-card">
          <h3>Pricing Plans</h3>
          <div className="stat-value">{stats.pricingPlans}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Quotes</h3>
          <div className="stat-value">{stats.pendingQuotes}</div>
        </div>
        <div className="stat-card">
          <h3>Blog Posts</h3>
          <div className="stat-value">{stats.blogPosts}</div>
        </div>
      </div>

      <div className="admin-sections-grid">
        <div className="admin-section-card">
          <h3>Recent Leads</h3>
          {recent.leads.length === 0 ? (
            <div className="empty-state">
              <p>No recent leads to display.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recent.leads.map(lead => (
                <li key={lead._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <strong>{lead.name}</strong> - {lead.projectType}
                  <br/>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.email} | Status: {lead.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="admin-section-card">
          <h3>Recent Projects</h3>
          {recent.projects.length === 0 ? (
            <div className="empty-state">
              <p>No recent projects to display.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recent.projects.map(project => (
                <li key={project._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <strong>{project.title}</strong>
                  <br/>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{project.category} | Status: {project.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
