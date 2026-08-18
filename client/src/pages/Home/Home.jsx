import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Monitor, Smartphone, Server } from 'lucide-react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import PricingCard from '../../components/PricingCard/PricingCard';
import CTA from '../../components/CTA/CTA';
import { services } from '../../data/services';
import { projects } from '../../data/projects';
import { pricing } from '../../data/pricing';
import './Home.css';

const Home = () => {
  const [activePlan, setActivePlan] = useState(pricing.find(p => p.isPopular)?.tier || pricing[0].tier);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">BUILD • CONNECT • DEPLOY</span>
            <h1 className="hero-title">Modern websites and web applications built for business.</h1>
            <p className="hero-subtitle">
              We engineer premium digital solutions that drive growth, engage users, and scale seamlessly.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Start a Project <ArrowRight size={20} className="icon-right" />
              </Link>
              <Link to="/projects" className="btn btn-secondary">
                View Our Work
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="abstract-graphic">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Capability Section */}
      <section className="capabilities-section">
        <div className="container capabilities-container">
          <div className="capability-item">
            <Code size={24} /> <span>MERN Development</span>
          </div>
          <div className="capability-item">
            <Monitor size={24} /> <span>Responsive Design</span>
          </div>
          <div className="capability-item">
            <Smartphone size={24} /> <span>Custom Web Apps</span>
          </div>
          <div className="capability-item">
            <Server size={24} /> <span>API Development</span>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Services</h2>
            <p>We provide end-to-end digital solutions designed to meet your specific business needs.</p>
          </div>
          <div className="services-grid">
            {services.slice(0, 4).map(service => (
              <ServiceCard 
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/services" className="btn btn-secondary">
              View All Services <ArrowRight size={20} className="icon-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why MernCraft */}
      <section className="why-us section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose MernCraft</h2>
            <p>We build with purpose, focusing on performance, scalability, and business results.</p>
          </div>
          <div className="why-grid">
            <div className="why-item">
              <h3>Custom-Built Solutions</h3>
              <p>We don't rely on generic templates. Every line of code is written to serve your unique business logic and brand identity.</p>
            </div>
            <div className="why-item">
              <h3>Modern Technology</h3>
              <p>We leverage the power of the MERN stack (MongoDB, Express, React, Node.js) for high performance and fast development cycles.</p>
            </div>
            <div className="why-item">
              <h3>Responsive Experiences</h3>
              <p>Your application will look and function flawlessly across all devices, ensuring maximum user engagement and accessibility.</p>
            </div>
            <div className="why-item">
              <h3>Business-Focused Development</h3>
              <p>We engineer solutions that solve real business problems, automate workflows, and increase your conversion rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="projects-preview section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Featured Work</h2>
            <p>Take a look at some of the recent projects we've successfully delivered.</p>
          </div>
          <div className="projects-editorial-list">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                variant={`editorial ${index % 2 !== 0 ? 'reverse' : ''}`}
              />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/projects" className="btn btn-secondary">
              View All Projects <ArrowRight size={20} className="icon-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Our Technology Stack</h2>
            <p>We use modern, reliable technologies to build scalable and maintainable applications.</p>
          </div>
          <div className="tech-grid">
            <div className="tech-item">React.js</div>
            <div className="tech-item">Node.js</div>
            <div className="tech-item">Express.js</div>
            <div className="tech-item">MongoDB</div>
            <div className="tech-item">JavaScript</div>
            <div className="tech-item">HTML5</div>
            <div className="tech-item">CSS3</div>
            <div className="tech-item">Figma</div>
            <div className="tech-item">Git</div>
            <div className="tech-item">GitHub</div>
          </div>
        </div>
      </section>

      {/* Process Preview */}
      <section className="process-preview section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>How We Work</h2>
            <p>Our streamlined process ensures transparency and quality at every step.</p>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <span className="step-number">01</span>
              <h4>Discover</h4>
            </div>
            <div className="process-step">
              <span className="step-number">02</span>
              <h4>Plan</h4>
            </div>
            <div className="process-step">
              <span className="step-number">03</span>
              <h4>Design</h4>
            </div>
            <div className="process-step">
              <span className="step-number">04</span>
              <h4>Develop</h4>
            </div>
            <div className="process-step">
              <span className="step-number">05</span>
              <h4>Test</h4>
            </div>
            <div className="process-step">
              <span className="step-number">06</span>
              <h4>Deploy</h4>
            </div>
            <div className="process-step">
              <span className="step-number">07</span>
              <h4>Support</h4>
            </div>
          </div>
          <div className="section-footer">
            <Link to="/process" className="btn btn-secondary">
              View Our Full Process <ArrowRight size={20} className="icon-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing-preview section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Transparent Pricing</h2>
            <p>Professional solutions tailored to your scale and requirements.</p>
          </div>
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
        </div>
      </section>

      <CTA />
    </div>
  );
};

export default Home;
