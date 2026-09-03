import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import '../AdminTableStyles.css';
import { useAuth } from '../../../context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(page, 10, searchTerm, roleFilter);
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      try {
        await userService.toggleStatus(id, !currentStatus);
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to update user status');
      }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>User Management</h2>
        
        <form className="admin-filters" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search by name, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input"
          />
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="admin-btn">Search</button>
        </form>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Date Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge status-${(user.isActive !== undefined ? user.isActive : user.active) ? 'active' : 'archived'}`}>
                      {(user.isActive !== undefined ? user.isActive : user.active) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {user._id !== currentUser.id ? (
                      <button 
                        onClick={() => handleToggleStatus(user._id, user.isActive !== undefined ? user.isActive : user.active)} 
                        className={`action-btn ${(user.isActive !== undefined ? user.isActive : user.active) ? 'delete-btn' : 'edit-btn'}`}
                      >
                        {(user.isActive !== undefined ? user.isActive : user.active) ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Current User</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
