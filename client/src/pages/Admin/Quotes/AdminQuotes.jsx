import React, { useState, useEffect } from 'react';
import quoteService from '../../../services/quoteService';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import '../AdminTableStyles.css';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    clientName: '',
    clientEmail: '',
    title: '',
    projectType: 'Custom Web Application',
    amount: '',
    details: '',
    notes: '',
    status: 'draft'
  });

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await quoteService.getQuotes();
      if (data.success) {
        setQuotes(data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await quoteService.createQuote({
        ...createFormData,
        amount: Number(createFormData.amount) || 0,
        total: Number(createFormData.amount) || 0
      });
      setIsCreateModalOpen(false);
      setCreateFormData({
        clientName: '',
        clientEmail: '',
        title: '',
        projectType: 'Custom Web Application',
        amount: '',
        details: '',
        notes: '',
        status: 'draft'
      });
      fetchQuotes();
    } catch (err) {
      alert(err.message || 'Failed to create quote');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await quoteService.updateQuote(id, { status: newStatus });
      fetchQuotes();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const executeDeleteQuote = async () => {
    if (!quoteToDelete) return;
    try {
      await quoteService.deleteQuote(quoteToDelete);
      setQuoteToDelete(null);
      fetchQuotes();
    } catch (err) {
      alert('Failed to delete quote');
    }
  };

  const openQuoteModal = (quote = null) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Quotes Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          + Create Quote
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Project</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : quotes.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No quotes found.</td></tr>
            ) : (
              quotes.map(quote => (
                <tr key={quote._id}>
                  <td><strong>{quote.clientName}</strong><br/><small>{quote.clientEmail}</small></td>
                  <td>{quote.title}<br/><small>{quote.projectType}</small></td>
                  <td>${quote.total}</td>
                  <td>
                    <select 
                      value={quote.status} 
                      onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                      className={`status-badge status-${quote.status === 'draft' ? 'draft' : quote.status === 'accepted' ? 'won' : 'lost'}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </td>
                  <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button onClick={() => openQuoteModal(quote)} className="action-btn view-btn">View</button>
                    <button onClick={() => setQuoteToDelete(quote._id)} className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedQuote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Quotation: {selectedQuote.title}</h3>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
            <div className="lead-details" style={{ marginTop: '20px' }}>
              <p><strong>Client:</strong> {selectedQuote.clientName} ({selectedQuote.clientEmail})</p>
              <p><strong>Status:</strong> {selectedQuote.status}</p>
              <p><strong>Subtotal:</strong> ${selectedQuote.subtotal}</p>
              <p><strong>Discount:</strong> ${selectedQuote.discount}</p>
              <p><strong>Total:</strong> ${selectedQuote.total}</p>
              
              {Array.isArray(selectedQuote.items) && selectedQuote.items.length > 0 && (
                <>
                  <h4>Items</h4>
                  <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    {selectedQuote.items.map((item, index) => (
                      <li key={index}>{item.description} - ${item.price} (Qty: {item.quantity})</li>
                    ))}
                  </ul>
                </>
              )}
              
              {selectedQuote.details && (
                <div className="message-box" style={{ marginBottom: '15px' }}>
                  <strong>Scope / Details:</strong>
                  <p>{selectedQuote.details}</p>
                </div>
              )}

              {selectedQuote.notes && (
                <div className="message-box">
                  <strong>Notes:</strong>
                  <p>{selectedQuote.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Quotation</h3>
            <button className="close-modal" onClick={() => setIsCreateModalOpen(false)}>X</button>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Client Name*</label>
                  <input required type="text" className="admin-input" style={{width: '100%'}} 
                    value={createFormData.clientName} onChange={e => setCreateFormData({...createFormData, clientName: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Client Email*</label>
                  <input required type="email" className="admin-input" style={{width: '100%'}} 
                    value={createFormData.clientEmail} onChange={e => setCreateFormData({...createFormData, clientEmail: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Quotation / Project Title*</label>
                  <input required type="text" className="admin-input" style={{width: '100%'}} 
                    value={createFormData.title} onChange={e => setCreateFormData({...createFormData, title: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Project Type</label>
                  <input type="text" className="admin-input" style={{width: '100%'}} 
                    value={createFormData.projectType} onChange={e => setCreateFormData({...createFormData, projectType: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Total Amount (₹)*</label>
                  <input required type="number" className="admin-input" style={{width: '100%'}} 
                    value={createFormData.amount} onChange={e => setCreateFormData({...createFormData, amount: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Status</label>
                  <select className="admin-select" style={{width: '100%'}} 
                    value={createFormData.status} onChange={e => setCreateFormData({...createFormData, status: e.target.value})}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Scope & Deliverables Details</label>
                <textarea className="admin-input" style={{width: '100%', minHeight: '80px'}} 
                  value={createFormData.details} onChange={e => setCreateFormData({...createFormData, details: e.target.value})} 
                  placeholder="Outline key phases, deliverables, timeline..." />
              </div>
              <div>
                <label>Internal Notes</label>
                <input type="text" className="admin-input" style={{width: '100%'}} 
                  value={createFormData.notes} onChange={e => setCreateFormData({...createFormData, notes: e.target.value})} 
                  placeholder="e.g. 50% advance upfront, 50% upon delivery" />
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
                Save & Issue Quotation
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!quoteToDelete}
        title="Delete Quotation"
        message="Are you sure you want to permanently delete this quotation record?"
        confirmText="Delete Quote"
        onConfirm={executeDeleteQuote}
        onCancel={() => setQuoteToDelete(null)}
      />
    </div>
  );
};

export default AdminQuotes;
