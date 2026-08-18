import React from 'react';
import { ArrowRight, LayoutTemplate } from 'lucide-react';
import './ProjectCard.css';

const ProjectCard = ({ project, variant = 'default' }) => {
  return (
    <div className={`project-card ${variant}`}>
      <div className="project-image-wrapper">
        {project.image ? (
          <img src={project.image} alt={project.name} className="project-image" />
        ) : (
          <div className="project-placeholder-image">
            <LayoutTemplate size={48} className="placeholder-icon" />
          </div>
        )}
      </div>
      <div className="project-content">
        <div className="project-meta">
          <span className="project-category">{project.category}</span>
        </div>
        <h3 className="project-name">{project.name}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tech">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-badge">{tech}</span>
          ))}
        </div>
        <a href={project.link || '#'} className="project-link" target="_blank" rel="noreferrer">
          View Project <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
