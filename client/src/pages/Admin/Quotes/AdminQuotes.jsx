import React, { useState, useEffect } from 'react';
import quoteService from '../../../services/quoteService';
import '../AdminTableStyles.css';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await quoteService.updateQuote(id, { status: newStatus });
      fetchQuotes();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await quoteService.deleteQuote(id);
        fetchQuotes();
      } catch (err) {
        alert('Failed to delete quote');
      }
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
        <button className="admin-btn admin-btn-primary" onClick={() => alert('Quotation builder feature coming soon!')}>
          Create Quote
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
                    <button onClick={() => handleDelete(quote._id)} className="action-btn delete-btn">Delete</button>
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
              
              <h4>Items</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                {selectedQuote.items.map((item, index) => (
                  <li key={index}>{item.description} - ${item.price} (Qty: {item.quantity})</li>
                ))}
              </ul>
              
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
    </div>
  );
};

export default AdminQuotes;
