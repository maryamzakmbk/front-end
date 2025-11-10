import React, { useState } from 'react';
import { useMemory } from '../../context/MemoryContext';
import { useAuth } from '../../context/AuthContext';
import MemoryCard from '../Common/MemoryCard';
import { Search, Filter, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const MemoryList = () => {
  const { memories, deleteMemory, updateMemory } = useMemory();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingMemory, setEditingMemory] = useState(null);

  // Filter memories by current user and search/filter criteria
  const userMemories = memories.filter(memory => 
    memory.creatorId === currentUser.id &&
    (searchTerm === '' || 
     memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     memory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filterCategory === '' || memory.category === filterCategory)
  );

  const categories = [...new Set(memories.map(memory => memory.category))];

  const handleDelete = async (memoryId) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(memoryId);
    }
  };

  const handlePrivacyChange = async (memoryId, newPrivacy) => {
    await updateMemory(memoryId, { privacy: newPrivacy });
  };

  return (
    <div>
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Memories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}
              />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Filter 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select"
                style={{ paddingLeft: '2.5rem' }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterCategory('')}
            className={`btn btn-sm ${filterCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All ({userMemories.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`btn btn-sm ${filterCategory === category ? 'btn-primary' : 'btn-secondary'}`}
            >
              {category} ({memories.filter(m => m.category === category && m.creatorId === currentUser.id).length})
            </button>
          ))}
        </div>
      </div>

      {userMemories.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500">
            {searchTerm || filterCategory ? 'No memories match your search criteria.' : 'You haven\'t created any memories yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userMemories.map(memory => (
            <div key={memory.id} className="memory-card">
              <MemoryCard memory={memory} />
              
              <div className="p-4 border-t border-gray-200">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handlePrivacyChange(
                        memory.id, 
                        memory.privacy === 'public' ? 'private' : 'public'
                      )}
                      className="btn btn-sm btn-secondary"
                      title={memory.privacy === 'public' ? 'Make Private' : 'Make Public'}
                    >
                      {memory.privacy === 'public' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    
                    <span style={{ 
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: memory.privacy === 'public' ? '#10b981' : 
                                      memory.privacy === 'private' ? '#6b7280' : '#f59e0b',
                      color: 'white'
                    }}>
                      {memory.privacy}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => setEditingMemory(memory)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryList;
