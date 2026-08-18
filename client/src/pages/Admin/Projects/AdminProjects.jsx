import React, { useState, useEffect } from 'react';
import projectService from '../../../services/projectService';
import '../AdminTableStyles.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', description: '', 
    image: '', projectUrl: '', githubUrl: '', status: 'draft', featured: false
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      if (data.success) setProjects(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title, slug: project.slug, category: project.category,
        description: project.description, image: project.image,
        projectUrl: project.projectUrl || '', githubUrl: project.githubUrl || '',
        status: project.status, featured: project.featured
      });
    } else {
      setSelectedProject(null);
      setFormData({
        title: '', slug: '', category: '', description: '', 
        image: '', projectUrl: '', githubUrl: '', status: 'draft', featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProject) {
        await projectService.update(selectedProject._id, formData);
      } else {
        await projectService.create(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id);
        fetchProjects();
      } catch (err) { alert('Delete failed'); }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Projects Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          + Add Project
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No projects found.</td></tr>
            ) : (
              projects.map(project => (
                <tr key={project._id}>
                  <td>
                    <strong>{project.title}</strong>
                    <br/><small style={{color:'var(--text-secondary)'}}>{project.slug}</small>
                  </td>
                  <td>{project.category}</td>
                  <td>
                    <span className={`status-badge status-${project.status}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.featured ? '⭐ Yes' : 'No'}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(project)} className="action-btn edit-btn">Edit</button>
                    <button onClick={() => handleDelete(project._id)} className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedProject ? 'Edit Project' : 'Add New Project'}</h3>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Title*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label>Slug* (e.g. e-commerce-platform)</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              <div>
                <label>Category*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div>
                <label>Image URL*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
              <div>
                <label>Description*</label>
                <textarea required className="admin-input" style={{width: '100%', minHeight: '80px'}} 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Status</label>
                  <select className="admin-select" style={{width: '100%'}} 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                    Featured Project
                  </label>
                </div>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
                {selectedProject ? 'Save Changes' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
