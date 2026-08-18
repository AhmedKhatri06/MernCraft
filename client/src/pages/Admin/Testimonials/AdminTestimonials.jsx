import React, { useState, useEffect } from 'react';
import testimonialService from '../../../services/testimonialService';
import '../AdminTableStyles.css';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '', company: '', review: '', rating: 5, profileImage: '', project: '', published: true
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getAll();
      if (data.success) setTestimonials(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        clientName: item.clientName, company: item.company, review: item.review, 
        rating: item.rating, profileImage: item.profileImage || '', project: item.project || '', published: item.published
      });
    } else {
      setSelectedItem(null);
      setFormData({
        clientName: '', company: '', review: '', rating: 5, profileImage: '', project: '', published: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await testimonialService.update(selectedItem._id, formData);
      } else {
        await testimonialService.create(formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { alert(err.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await testimonialService.delete(id);
        fetchItems();
      } catch (err) { alert('Delete failed'); }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Testimonials Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          + Add Testimonial
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Review Snippet</th>
              <th>Rating</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : testimonials.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign:'center'}}>No testimonials found.</td></tr>
            ) : (
              testimonials.map(item => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.clientName}</strong>
                    <br/><small style={{color:'var(--text-secondary)'}}>{item.company}</small>
                  </td>
                  <td>{item.review.substring(0, 50)}...</td>
                  <td>{'⭐'.repeat(item.rating)}</td>
                  <td>
                    <span className={`status-badge status-${item.published ? 'published' : 'draft'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(item)} className="action-btn edit-btn">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedItem ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Client Name*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
              </div>
              <div>
                <label>Company*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
              <div>
                <label>Review*</label>
                <textarea required className="admin-input" style={{width: '100%', minHeight: '100px'}} 
                  value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} />
              </div>
              <div>
                <label>Rating (1-5)*</label>
                <input required type="number" min="1" max="5" className="admin-input" style={{width: '100%'}} 
                  value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
              </div>
              <div>
                <label>Profile Image URL</label>
                <input type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.profileImage} onChange={e => setFormData({...formData, profileImage: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  Published
                </label>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
                {selectedItem ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
