import React, { useState, useEffect } from 'react';
import pricingService from '../../../services/pricingService';
import '../AdminTableStyles.css';

const AdminPricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    tier: '', slug: '', price: '', description: '', features: '', isPopular: false, order: 0, active: true
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await pricingService.getAll();
      if (data.success) setPlans(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        tier: plan.tier || plan.name || '',
        slug: plan.slug || '',
        price: plan.price || '',
        description: plan.description || '',
        features: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
        isPopular: plan.isPopular !== undefined ? plan.isPopular : (plan.popular || false),
        order: plan.order || 0,
        active: plan.active !== undefined ? plan.active : true
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        tier: '', slug: '', price: '', description: '', features: '', isPopular: false, order: plans.length, active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tier: formData.tier,
        isPopular: formData.isPopular,
        features: typeof formData.features === 'string' 
          ? formData.features.split('\n').map(f => f.trim()).filter(f => f)
          : formData.features
      };
      
      if (selectedPlan) {
        await pricingService.update(selectedPlan._id, payload);
      } else {
        await pricingService.create(payload);
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing plan?')) {
      try {
        await pricingService.delete(id);
        fetchPlans();
      } catch (err) { alert('Delete failed'); }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Pricing Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          + Add Plan
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Tier</th>
              <th>Price</th>
              <th>Popular</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No pricing plans found.</td></tr>
            ) : (
              plans.map(plan => (
                <tr key={plan._id}>
                  <td>{plan.order}</td>
                  <td>
                    <strong>{plan.tier || plan.name}</strong>
                    {plan.slug && <><br/><small style={{color:'var(--text-secondary)'}}>{plan.slug}</small></>}
                  </td>
                  <td>{plan.price}</td>
                  <td>{plan.isPopular || plan.popular ? '🔥 Yes' : 'No'}</td>
                  <td>
                    <span className={`status-badge status-${plan.active ? 'active' : 'draft'}`}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(plan)} className="action-btn edit-btn">Edit</button>
                    <button onClick={() => handleDelete(plan._id)} className="action-btn delete-btn">Delete</button>
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
            <h3>{selectedPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</h3>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Tier Name* (e.g. Starter, Professional)</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} />
              </div>
              <div>
                <label>Slug</label>
                <input type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              <div>
                <label>Price* (e.g. ₹14,999 or $199)</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label>Description*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label>Features (One per line)*</label>
                <textarea required className="admin-input" style={{width: '100%', minHeight: '100px'}} 
                  value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} 
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Display Order</label>
                  <input type="number" className="admin-input" style={{width: '100%'}} 
                  value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                    Active (Publicly Visible)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} />
                    Mark as Popular
                  </label>
                </div>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
                {selectedPlan ? 'Save Changes' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
