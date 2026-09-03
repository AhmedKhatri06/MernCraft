import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code } from 'lucide-react';
import * as Icons from 'lucide-react';
import './ServiceCard.css';

const ServiceCard = ({ icon, title, description, link }) => {
  let RenderIcon = Code;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && icon.$$typeof)) {
    RenderIcon = icon;
  } else if (typeof icon === 'string' && Icons[icon]) {
    RenderIcon = Icons[icon];
  }

  return (
    <div className="service-card">
      <div className="service-icon">
        <RenderIcon size={32} />
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
