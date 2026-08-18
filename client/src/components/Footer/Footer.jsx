import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/loog.jpeg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logoImg} alt="MernCraft Logo" className="logo-image" />
            </Link>
            <p className="footer-desc">Professional MERN Stack web development and software solutions. We build fast, scalable, and beautifully designed digital products for modern businesses.</p>

            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <Mail size={16} /> <span><a href='mailto:khatriahmed405@gmail.com'>khatriahmed405@gmail.com</a></span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} /> <span><a href='tel:+917096106541'>+91 7096106541</a></span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={16} /> <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/process">Our Process</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Work With Us</h4>
            <ul>
              <li><Link to="/process">Our Process</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Start a Project</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MernCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
