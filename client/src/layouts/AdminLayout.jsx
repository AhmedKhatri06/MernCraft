import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/Admin/Dashboard/AdminDashboard.css'; // Re-use the existing styles

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/only-logo.png" alt="MernCraft" />
          <span>Admin</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
          <NavLink to="/admin/leads" className={({ isActive }) => (isActive ? 'active' : '')}>Leads</NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => (isActive ? 'active' : '')}>Projects</NavLink>
          <NavLink to="/admin/services" className={({ isActive }) => (isActive ? 'active' : '')}>Services</NavLink>
          <NavLink to="/admin/pricing" className={({ isActive }) => (isActive ? 'active' : '')}>Pricing</NavLink>
          <NavLink to="/admin/quotes" className={({ isActive }) => (isActive ? 'active' : '')}>Quotes</NavLink>
          <NavLink to="/admin/testimonials" className={({ isActive }) => (isActive ? 'active' : '')}>Testimonials</NavLink>
          <NavLink to="/admin/blog" className={({ isActive }) => (isActive ? 'active' : '')}>Blog</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>Users</NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>Settings</NavLink>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Portal</h1>
          <div className="admin-profile">
            <span>{user?.name}</span>
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet /> {/* This is where the specific admin pages will render */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
