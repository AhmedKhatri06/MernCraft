import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Signup/Signup.css'; // Reusing signup styles

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Log in to your MernCraft account.</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ marginBottom: '0' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: 'var(--primary-color)' }}>Forgot Password?</Link>
            </div>
            <div className="password-input" style={{ marginTop: '5px' }}>
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
              <button type="button" className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
