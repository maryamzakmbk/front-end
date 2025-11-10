import React, { useState } from 'react';
import { useMemory } from '../../context/MemoryContext';
import { useAuth } from '../../context/AuthContext';
import { X, Upload } from 'lucide-react';

const AddMemoryForm = ({ isOpen, onClose, onSuccess }) => {
  const { addMemory } = useMemory();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    tags: '',
    privacy: 'public',
    category: 'Personal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Personal', 'Travel', 'Education', 'Family', 'Friends', 
    'Celebration', 'Work', 'Hobby', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      const memoryData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        creatorId: currentUser.id,
        media: [] // In a real app, you would handle file uploads
      };

      await addMemory(memoryData);
      onSuccess();
      onClose();
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        tags: '',
        privacy: 'public',
        category: 'Personal'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Memory</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter memory title"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your memory..."
                rows="4"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Where did this happen?"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="Add tags separated by commas (e.g., vacation, family, beach)"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Privacy</label>
              <select
                name="privacy"
                value={formData.privacy}
                onChange={handleChange}
                className="form-select"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="followers">Followers Only</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Media</label>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <Upload size={32} style={{ margin: '0 auto 1rem' }} />
                <p>Click to upload or drag and drop</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Adding...' : 'Add Memory'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryForm;
