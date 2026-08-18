import React, { useState, useEffect } from 'react';
import blogService from '../../../services/blogService';
import '../AdminTableStyles.css';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', coverImage: '', category: '', tags: '', author: 'Admin', status: 'draft'
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAll();
      if (data.success) setPosts(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, 
        coverImage: item.coverImage || '', category: item.category, tags: item.tags.join(', '), 
        author: item.author, status: item.status
      });
    } else {
      setSelectedItem(null);
      setFormData({
        title: '', slug: '', excerpt: '', content: '', coverImage: '', category: '', tags: '', author: 'Admin', status: 'draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (selectedItem) {
        await blogService.update(selectedItem._id, payload);
      } else {
        await blogService.create(payload);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { alert(err.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await blogService.delete(id);
        fetchItems();
      } catch (err) { alert('Delete failed'); }
    }
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Blog Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
          + Create Post
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>No posts found.</td></tr>
            ) : (
              posts.map(item => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.title}</strong>
                    <br/><small style={{color:'var(--text-secondary)'}}>{item.slug}</small>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.author}</td>
                  <td>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(item)} className="action-btn edit-btn">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="action-btn delete-btn">Delete</button>
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
            <h3>{selectedItem ? 'Edit Post' : 'Create Post'}</h3>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Title*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Slug* (e.g. how-to-build)</label>
                  <input required type="text" className="admin-input" style={{width: '100%'}} 
                    value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Category*</label>
                  <input required type="text" className="admin-input" style={{width: '100%'}} 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>
              <div>
                <label>Cover Image URL*</label>
                <input required type="text" className="admin-input" style={{width: '100%'}} 
                  value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
              </div>
              <div>
                <label>Excerpt*</label>
                <textarea required className="admin-input" style={{width: '100%', minHeight: '60px'}} 
                  value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
              </div>
              <div>
                <label>Content (Markdown or Text)*</label>
                <textarea required className="admin-input" style={{width: '100%', minHeight: '200px'}} 
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Tags (Comma separated)</label>
                  <input type="text" className="admin-input" style={{width: '100%'}} 
                    value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Status</label>
                  <select className="admin-select" style={{width: '100%'}} 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '10px' }}>
                {selectedItem ? 'Save Changes' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
