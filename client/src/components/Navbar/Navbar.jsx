import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../../assets/loog.png';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src={logoImg} alt="MernCraft Logo" className="logo-image" />
        </Link>

        <div className={`nav-overlay ${isOpen ? 'open' : ''}`} onClick={toggleMenu}></div>

        <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projects</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/process" className={location.pathname === '/process' ? 'active' : ''}>Process</Link>
          <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>Pricing</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          
          {/* Mobile Auth Links */}
          <div className="mobile-only-links" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            {!user ? (
              <>
                <Link to="/login" className="btn" style={{ marginBottom: '10px' }}>Log In</Link>
                <Link to="/signup" className="btn" style={{ marginBottom: '10px' }}>Sign Up</Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="btn" style={{ marginBottom: '10px' }}>Admin</Link>
                ) : (
                  <Link to="/dashboard" className="btn" style={{ marginBottom: '10px' }}>Dashboard</Link>
                )}
                <button onClick={logout} className="btn" style={{ marginBottom: '10px' }}>Log Out</button>
              </>
            )}
            <Link to="/contact" className="btn btn-primary" style={{ marginBottom: '10px' }}>Start a Project</Link>
          </div>
        </nav>

        <div className="nav-actions">
          <div className="nav-cta desktop-cta" style={{ display: 'flex', alignItems: 'center' }}>
            {!user ? (
              <>
                <Link to="/login" className="auth-btn-nav" style={{ marginRight: '15px', fontWeight: '600' }}>Log In</Link>
                <Link to="/signup" className="auth-btn-nav" style={{ marginRight: '15px', fontWeight: '600' }}>Sign Up</Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="auth-btn-nav" style={{ marginRight: '15px', fontWeight: '600', color: 'var(--mc-green)' }}>Admin Area</Link>
                ) : (
                  <Link to="/dashboard" className="auth-btn-nav" style={{ marginRight: '15px', fontWeight: '600' }}>Dashboard</Link>
                )}
                <button onClick={logout} className="auth-btn-nav" style={{ marginRight: '15px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Log Out</button>
              </>
            )}
            <Link to="/contact" className="btn btn-primary">Start a Project</Link>
          </div>
          <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
