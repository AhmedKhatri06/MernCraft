import React, { useState, useEffect } from 'react';
import leadService from '../../../services/leadService';
import '../AdminTableStyles.css'; // Shared CSS for tables

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeads(page, 10, searchTerm, statusFilter);
      if (data.success) {
        setLeads(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadService.updateLead(id, { status: newStatus });
      fetchLeads();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        fetchLeads();
      } catch (err) {
        alert('Failed to delete lead');
      }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Leads Management</h2>

        <form className="admin-filters" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="discussion">Discussion</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
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
              <th>Project Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No leads found.</td></tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id}>
                  <td><strong>{lead.name}</strong><br /><small>{lead.company}</small></td>
                  <td>{lead.email}<br /><small>{lead.phone}</small></td>
                  <td>{lead.projectType}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`status-badge status-${lead.status}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="discussion">Discussion</option>
                      <option value="proposal">Proposal</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button onClick={() => setSelectedLead(lead)} className="action-btn view-btn">View</button>
                    <button onClick={() => handleDelete(lead._id)} className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* View Lead Modal */}
      {selectedLead && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Lead Details</h3>
            <button className="close-modal" onClick={() => setSelectedLead(null)}>X</button>
            <div className="lead-details">
              <p><strong>Name:</strong> {selectedLead.name}</p>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Company:</strong> {selectedLead.company || 'N/A'}</p>
              <p><strong>Project Type:</strong> {selectedLead.projectType}</p>
              <p><strong>Budget:</strong> {selectedLead.budget || 'N/A'}</p>
              <p><strong>Preference:</strong> {selectedLead.contactPreference}</p>
              <div className="message-box">
                <strong>Message:</strong>
                <p>{selectedLead.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
