import React, { useState, useEffect } from 'react';
import settingsService from '../../../services/settingsService';
import '../AdminTableStyles.css';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', email: '', role: '',
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await settingsService.getProfile();
        if (data.success) {
          setFormData({
            ...formData,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      setError('Current password is required to set a new password');
      return;
    }

    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      const data = await settingsService.updateProfile(payload);
      if (data.success) {
        setSuccess('Profile updated successfully');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="admin-module"><p>Loading...</p></div>;

  return (
    <div className="admin-module" style={{ maxWidth: '600px' }}>
      <div className="module-header">
        <h2>Admin Settings</h2>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-error" style={{backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0'}}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ marginBottom: '15px' }}>Profile Information</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
            <input required type="text" className="admin-input" style={{width: '100%'}} 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
            <input required type="email" className="admin-input" style={{width: '100%'}} 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
            <input type="text" className="admin-input" style={{width: '100%', backgroundColor: 'var(--bg-tertiary)'}} 
              value={formData.role.toUpperCase()} disabled />
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ marginBottom: '15px' }}>Change Password</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '15px' }}>Leave blank if you do not wish to change your password.</p>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Current Password</label>
            <input type="password" className="admin-input" style={{width: '100%'}} 
              value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
            <input type="password" className="admin-input" style={{width: '100%'}} 
              value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirm New Password</label>
            <input type="password" className="admin-input" style={{width: '100%'}} 
              value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
