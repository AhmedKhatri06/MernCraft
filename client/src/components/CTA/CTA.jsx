import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CTA.css';

const CTA = ({ title = "Have a Project in Mind?", subtitle = "Let's discuss your requirements and build something extraordinary together.", buttonText = "Start Your Project", buttonLink = "/contact" }) => {
  return (
    <>
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <div className="cta-action">
            <Link to={buttonLink} className="btn btn-primary cta-btn">
              {buttonText} <ArrowRight size={20} className="icon-right" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};


export default CTA;
