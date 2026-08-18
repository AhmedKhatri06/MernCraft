import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(token, password);
      setSuccess('Password has been reset successfully. You can now login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-error" style={{backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0'}}>{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading || success}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
