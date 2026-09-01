import React, { useState, useEffect } from 'react';
import PricingCard from '../../components/PricingCard/PricingCard';
import CTA from '../../components/CTA/CTA';
import publicService from '../../services/publicService';
import './Pricing.css';

const Pricing = () => {
  const [pricing, setPricing] = useState([]);
  const [activePlan, setActivePlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await publicService.getPublicPricing();
        if (data.success) {
          setPricing(data.data);
          if (data.data.length > 0) {
            setActivePlan(data.data.find(p => p.isPopular)?.tier || data.data[0].tier);
          }
        }
      } catch (err) {
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <div className="pricing-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Transparent Pricing</h2>
            <p>Professional solutions tailored to your scale and requirements. Final pricing depends on project scope, features, integrations and complexity.</p>
          </div>

          {loading ? (
             <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>Loading pricing plans...</div>
          ) : error ? (
             <div className="error-state" style={{ textAlign: 'center', color: 'red', padding: '3rem' }}>{error}</div>
          ) : pricing.length === 0 ? (
             <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>No pricing plans available at the moment.</div>
          ) : (
            <>
              <div className="pricing-selector-mobile">
                {pricing.map((tier) => (
                  <button
                    key={tier.tier}
                    className={`pricing-tab ${activePlan === tier.tier ? 'active' : ''}`}
                    onClick={() => setActivePlan(tier.tier)}
                  >
                    {tier.tier}
                  </button>
                ))}
              </div>

              <div className="pricing-grid">
                {pricing.map((tier, index) => (
                  <div
                    key={index}
                    className={`pricing-card-wrapper ${activePlan === tier.tier ? 'active' : 'inactive'}`}
                    onClick={() => setActivePlan(tier.tier)}
                  >
                    <PricingCard
                      tier={tier.tier}
                      price={tier.price}
                      description={tier.description}
                      features={tier.features}
                      isPopular={tier.isPopular}
                      isActive={activePlan === tier.tier}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="pricing-disclaimer">
            <p>
              + According to the Requirements of the Client.
              <br />
              * The prices listed above are starting points. Every business is unique, and we provide custom quotes based on a detailed technical discovery phase.</p>
          </div>
        </div>
      </div>

      <div className="faq-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-container">
            <div className="faq-item">
              <h4>How much does a website cost?</h4>
              <p>Costs vary depending on features, design complexity, and the technology stack. A basic professional website starts at ₹14,999, while custom web applications can exceed ₹1,00,000.</p>
            </div>
            <div className="faq-item">
              <h4>How long does a website take to build?</h4>
              <p>A standard business website takes 2-4 weeks. E-Commerce and custom web applications typically take 6-12 weeks depending on the scope.</p>
            </div>
            <div className="faq-item">
              <h4>Do you provide hosting and deployment?</h4>
              <p>Yes, we handle the complete deployment process including cloud server setup (AWS/DigitalOcean/Vercel), domain configuration, and SSL certificates.</p>
            </div>
            <div className="faq-item">
              <h4>What technologies do you use?</h4>
              <p>We specialize in the MERN stack (MongoDB, Express.js, React.js, Node.js) for full-stack applications, ensuring scalability, speed, and security.</p>
            </div>
          </div>
        </div>
      </div>

      <CTA />
    </div>
  );
};

export default Pricing;
