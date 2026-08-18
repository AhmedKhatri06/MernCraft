import React from 'react';
import CTA from '../../components/CTA/CTA';
import './Process.css';

const processSteps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Understand your business, goals, target audience, and specific requirements.',
    deliverables: ['Requirements Document', 'Project Scope', 'Initial Consultation']
  },
  {
    num: '02',
    title: 'Planning',
    desc: 'Define the technical architecture, features, database schema, and project timeline.',
    deliverables: ['System Architecture', 'Tech Stack Selection', 'Timeline']
  },
  {
    num: '03',
    title: 'UI/UX Design',
    desc: 'Design the user experience and interface using modern design principles and tools like Figma.',
    deliverables: ['Wireframes', 'High-Fidelity Mockups', 'Interactive Prototypes']
  },
  {
    num: '04',
    title: 'Development',
    desc: 'Build the frontend, backend, and database using the MERN stack with scalable code architecture.',
    deliverables: ['Frontend Code', 'Backend APIs', 'Database Integration']
  },
  {
    num: '05',
    title: 'Testing',
    desc: 'Test functionality, mobile responsiveness, performance, and handle edge cases.',
    deliverables: ['QA Reports', 'Bug Fixes', 'Performance Optimization']
  },
  {
    num: '06',
    title: 'Deployment',
    desc: 'Deploy the production application to a secure and scalable cloud infrastructure.',
    deliverables: ['Live Application', 'Domain Setup', 'SSL Configuration']
  },
  {
    num: '07',
    title: 'Support',
    desc: 'Provide post-launch support, monitoring, and ongoing improvements.',
    deliverables: ['Maintenance Plan', 'Performance Monitoring', 'Regular Updates']
  }
];

const Process = () => {
  return (
    <div className="process-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Our Development Process</h2>
            <p>A transparent, step-by-step approach to turning your vision into a production-ready reality.</p>
          </div>

          <div className="process-timeline">
            {processSteps.map((step, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-num">{step.num}</div>
                <div className="timeline-content">
                  <h3>{step.title}</h3>
                  <p className="timeline-desc">{step.desc}</p>
                  <div className="timeline-deliverables">
                    <strong>Deliverables:</strong>
                    <ul>
                      {step.deliverables.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CTA title="Ready to Start the Process?" />
    </div>
  );
};

export default Process;
