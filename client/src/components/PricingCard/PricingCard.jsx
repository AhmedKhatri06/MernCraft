import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import './PricingCard.css';

const PricingCard = ({ tier, price, description, features, isPopular, isActive = false }) => {
  return (
    <div className={`pricing-card ${isPopular ? 'popular' : ''} ${isActive ? 'active-selection' : ''}`}>
      {isPopular && <div className="popular-badge">MOST POPULAR</div>}
      <div className="pricing-header">
        <h3 className="pricing-tier">{tier}</h3>
        <p className="pricing-desc">{description}</p>
        <div className="pricing-price">
          <span className="price-label">Starting From</span>
          <span className="price-amount">{price}</span>
        </div>
      </div>
      <div className="pricing-body">
        <ul className="pricing-features">
          {features.map((feature, index) => (
            <li key={index}>
              <Check size={18} className="feature-icon" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pricing-footer">
        <Link to={`/contact?plan=${tier.toLowerCase()}`} className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} full-width`}>
          Request a Custom Quote
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
