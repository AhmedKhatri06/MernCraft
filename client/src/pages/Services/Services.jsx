import React from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import CTA from '../../components/CTA/CTA';
import { services } from '../../data/services';

const Services = () => {
  return (
    <div className="services-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive digital solutions tailored to your business goals. We handle everything from design to deployment.</p>
          </div>
          
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard 
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={`/contact?service=${service.id}`}
              />
            ))}
          </div>
        </div>
      </div>
      <CTA title="Ready to Upgrade Your Digital Presence?" />
    </div>
  );
};

export default Services;
