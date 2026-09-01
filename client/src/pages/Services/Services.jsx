import React, { useState, useEffect } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import CTA from '../../components/CTA/CTA';
import publicService from '../../services/publicService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await publicService.getPublicServices();
        if (data.success) {
          // Only show active services and map DB 'name' to UI 'title'
          const activeServices = data.data
            .filter(s => s.active !== false)
            .map(s => ({
              id: s._id,
              title: s.name,
              description: s.description,
              icon: s.icon || 'Code', // fallback icon
              link: `/contact?service=${s.slug || s._id}`
            }));
          setServices(activeServices);
        }
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive digital solutions tailored to your business goals. We handle everything from design to deployment.</p>
          </div>
          
          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>Loading services...</div>
          ) : error ? (
            <div className="error-state" style={{ textAlign: 'center', color: 'red', padding: '3rem' }}>{error}</div>
          ) : services.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>No services available at the moment.</div>
          ) : (
            <div className="services-grid">
              {services.map(service => (
                <ServiceCard 
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={service.link}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CTA title="Ready to Upgrade Your Digital Presence?" />
    </div>
  );
};

export default Services;
