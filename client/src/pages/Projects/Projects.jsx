import React, { useState, useEffect } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import CTA from '../../components/CTA/CTA';
import publicService from '../../services/publicService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await publicService.getPublicProjects();
        if (data.success) {
          const formattedProjects = data.data.map(p => ({
            id: p._id,
            name: p.name,
            title: p.name,
            category: p.category,
            description: p.description,
            image: p.image || 'https://via.placeholder.com/800x600?text=Project',
            technologies: p.technologies || [],
            link: p.link || '#'
          }));
          setProjects(formattedProjects);
        }
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="projects-page">
      <div className="section-padding bg-tertiary">
        <div className="container">
          <div className="section-header">
            <h2>Our Portfolio</h2>
            <p>Explore some of the recent projects we've designed and developed for our clients.</p>
          </div>
          
          {loading ? (
             <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>Loading projects...</div>
          ) : error ? (
             <div className="error-state" style={{ textAlign: 'center', color: 'red', padding: '3rem' }}>{error}</div>
          ) : projects.length === 0 ? (
             <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>No projects available at the moment.</div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
      <CTA title="Want to See Your Project Here?" />
    </div>
  );
};

export default Projects;
