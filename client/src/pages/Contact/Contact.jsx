import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
    contactPreference: 'email'
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your project request has been received. We will contact you shortly.' });
        setFormData({
          name: '', email: '', phone: '', company: '', projectType: '', budget: '', message: '', contactPreference: 'email'
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the server. Please check your connection or try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page section-padding bg-tertiary">
      <div className="container">
        <div className="contact-header">
          <h2>Have a Project in Mind?</h2>
          <p>Tell us about your requirements, and we'll help you build the perfect solution for your business.</p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <div className="info-card">
              <h3>Let's Build Together</h3>
              <p>Whether you need a modern business website, a custom web application, or a complete digital transformation, MernCraft is here to deliver.</p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon"><Mail size={20} /></div>
                  <div>
                    <h4>Email Us</h4>
                    <p><a href="mailto:khatriahmed405@gmail.com">khatriahmed405@gmail.com</a></p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><Phone size={20} /></div>
                  <div>
                    <h4>Call Us</h4>
                    <p><a href='tel:+917096106541'>+91 7096106541</a></p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><MapPin size={20} /></div>
                  <div>
                    <h4>Location</h4>
                    <p><a href='https://www.google.com/maps/place/Rizwan+C.H.S./@19.1412192,72.8205715,15z/am=t/data=!3m1!4b1!4m6!3m5!1s0x3be7b63a82dbead9:0xb3e0cfabe03adb1c!8m2!3d19.1411998!4d72.8390256!16s%2Fg%2F11bxvb3snt?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D'>Mumbai, Maharashtra, India</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`form-status ${status.type}`}>
                  {status.message}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company / Business Name</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="projectType">Project Type *</label>
                  <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange}>
                    <option value="" disabled>Select Project Type</option>
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
                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" name="budget" value={formData.budget} onChange={handleChange}>
                    <option value="" disabled>Select Budget</option>
                    <option value="Under ₹15,000">Under ₹15,000</option>
                    <option value="₹15,000–₹30,000">₹15,000–₹30,000</option>
                    <option value="₹30,000–₹60,000">₹30,000–₹60,000</option>
                    <option value="₹60,000–₹1,00,000">₹60,000–₹1,00,000</option>
                    <option value="₹1,00,000+">₹1,00,000+</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Description *</label>
                <textarea id="message" name="message" required rows="5" value={formData.message} onChange={handleChange} placeholder="Tell us about your goals, features you need, and timeline..."></textarea>
              </div>

              <div className="form-group">
                <label>Preferred Contact Method</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="contactPreference" value="email" checked={formData.contactPreference === 'email'} onChange={handleChange} />
                    Email
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="contactPreference" value="phone" checked={formData.contactPreference === 'phone'} onChange={handleChange} />
                    Phone Call
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="contactPreference" value="whatsapp" checked={formData.contactPreference === 'whatsapp'} onChange={handleChange} />
                    WhatsApp
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                {loading ? 'Sending...' : (
                  <>Send Request <Send size={18} className="icon-right" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
