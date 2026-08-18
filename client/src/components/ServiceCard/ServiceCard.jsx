import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ServiceCard.css';

const ServiceCard = ({ icon: Icon, title, description, link }) => {
  return (
    <div className="service-card">
      <div className="service-icon">
        <Icon size={32} />
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{description}</p>
      <Link to={link || '/services'} className="service-link">
        View Service <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default ServiceCard;
