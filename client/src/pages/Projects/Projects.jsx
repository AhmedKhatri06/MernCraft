import React from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import CTA from '../../components/CTA/CTA';
import { projects } from '../../data/projects';

const Projects = () => {
  return (
    <div className="projects-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Our Portfolio</h2>
            <p>Explore some of the recent projects we've designed and developed for our clients.</p>
          </div>
          
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      <CTA title="Want to See Your Project Here?" />
    </div>
  );
};

export default Projects;
