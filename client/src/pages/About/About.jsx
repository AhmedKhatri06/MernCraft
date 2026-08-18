import React from 'react';
import CTA from '../../components/CTA/CTA';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="about-hero">
            <h1>We Are MernCraft</h1>
            <p className="lead">A professional web development and software solutions company dedicated to building modern, scalable, and high-performance digital products.</p>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h2>What We Do</h2>
              <p>MernCraft specializes in the MERN stack (MongoDB, Express, React, Node.js) to deliver custom web applications, e-commerce platforms, and business websites. We believe in writing clean code, designing intuitive user interfaces, and creating solutions that actually solve business problems.</p>
              
              <h2>Our Technology Philosophy</h2>
              <p>We don't just use tools because they are popular; we use them because they are the right fit for the job. Our architecture is built for speed, security, and scalability. We prioritize performance and technical SEO from day one.</p>
            </div>
            
            <div className="about-values">
              <h2>Our Core Values</h2>
              <ul className="values-list">
                <li>
                  <strong>Quality:</strong> We never compromise on code quality or design aesthetics. Every project is built to professional standards.
                </li>
                <li>
                  <strong>Transparency:</strong> Clear communication, honest timelines, and straightforward pricing.
                </li>
                <li>
                  <strong>Innovation:</strong> Staying ahead of the curve with modern frameworks and best practices.
                </li>
                <li>
                  <strong>Reliability:</strong> We deliver what we promise, when we promise it.
                </li>
                <li>
                  <strong>Scalability:</strong> Building solutions that grow seamlessly alongside your business.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <CTA />
    </div>
  );
};

export default About;
