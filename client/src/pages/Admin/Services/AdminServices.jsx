import React, { useState, useEffect } from 'react';
import serviceService from '../../../services/serviceService';
import '../AdminTableStyles.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', startingPrice: '', icon: '', order: 0, active: true
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll();
      if (data.success) setServices(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        name: service.name, slug: service.slug, description: service.description,
        startingPrice: service.startingPrice, icon: service.icon,
        order: service.order, active: service.active
      });
    } else {
      setSelectedService(null);
      setFormData({
        name: '', slug: '', description: '', startingPrice: '', icon: '', order: services.length, active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedService) {
        await serviceService.update(selectedService._id, formData);
      } else {
        await serviceService.create(formData);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.delete(id);
        fetchServices();
      } catch (err) { alert('Delete failed'); }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Services Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          + Add Service
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Starting Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign:'center'}}>No services found.</td></tr>
            ) : (
              services.map(service => (
                <tr key={service._id}>
                  <td>{service.order}</td>
                  <td>
                    <strong>{service.name}</strong>
                    <br/><small style={{color:'var(--text-secondary)'}}>{service.slug}</small>
                  </td>
                  <td>{service.startingPrice}</td>
                  <td>
                    <span className={`status-badge status-${service.active ? 'active' : 'draft'}`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(service)} className="action-btn edit-btn">Edit</button>
                    <button onClick={() => handleDelete(service._id)} className="action-btn delete-btn">Delete</button>
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
            <h3>{selectedService ? 'Edit Service' : 'Add New Service'}</h3>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Name*</label>
                <select required className="admin-input" style={{width: '100%'}} 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}>
                  <option value="" disabled>Select Service Name</option>
                  <option value="Business Website">Business Website</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Custom Web Application">Custom Web Application</option>
                  <option value="Admin Dashboard">Admin Dashboard</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="API / Backend">API / Backend</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Slug*</label>
                <select required className="admin-input" style={{width: '100%'}} 
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}>
                  <option value="" disabled>Select Slug</option>
                  <option value="business-website">business-website</option>
                  <option value="e-commerce">e-commerce</option>
                  <option value="custom-web-application">custom-web-application</option>
                  <option value="admin-dashboard">admin-dashboard</option>
                  <option value="website-redesign">website-redesign</option>
                  <option value="api-backend">api-backend</option>
                  <option value="ui-ux">ui-ux</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <label>Starting Price Range*</label>
                <select required className="admin-input" style={{width: '100%'}} 
                  value={formData.startingPrice} onChange={e => setFormData({...formData, startingPrice: e.target.value})}>
                  <option value="" disabled>Select Price Range</option>
                  <option value="Under ₹15,000">Under ₹15,000</option>
                  <option value="₹15,000–₹30,000">₹15,000–₹30,000</option>
                  <option value="₹30,000–₹60,000">₹30,000–₹60,000</option>
                  <option value="₹60,000–₹1,00,000">₹60,000–₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+</option>
                </select>
              </div>
              <div>
                <label>Icon Identifier (e.g. Code, Database)</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
              </div>
              <div>
                <label>Description*</label>
                <textarea required className="admin-input" style={{width: '100%', minHeight: '80px'}} 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Display Order</label>
                  <input type="number" className="admin-input" style={{width: '100%'}} 
                  value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                    Active (Publicly Visible)
                  </label>
                </div>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
                {selectedService ? 'Save Changes' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
