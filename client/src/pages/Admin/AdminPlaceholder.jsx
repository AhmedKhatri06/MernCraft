import React from 'react';

const AdminPlaceholder = ({ title }) => {
  return (
    <div className="admin-section-card" style={{ padding: '40px', textAlign: 'center' }}>
      <h2>{title} Management</h2>
      <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
        This module is currently under development. Here you will be able to manage all your {title.toLowerCase()}.
      </p>
    </div>
  );
};

export default AdminPlaceholder;
