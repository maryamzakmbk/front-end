import React, { useState } from 'react';
import { useMemory } from '../context/MemoryContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Common/Navbar';
import MemoryCard from '../components/Common/MemoryCard';
import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react';

const PublicMemories = () => {
  const { memories, users, likeMemory } = useMemory();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const publicMemories = memories.filter(memory => 
    memory.privacy === 'public' &&
    (searchTerm === '' || 
     memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     memory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filterCategory === '' || memory.category === filterCategory) &&
    (filterLocation === '' || memory.location?.toLowerCase().includes(filterLocation.toLowerCase()))
  );

  const categories = [...new Set(memories.map(memory => memory.category))];
  const locations = [...new Set(memories.map(memory => memory.location).filter(Boolean))];

  const handleLike = (memoryId) => {
    if (currentUser) {
      likeMemory(memoryId, currentUser.id);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <div className="card p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">Public Memories</h1>
          <p className="text-gray-500">
            Discover and explore memories shared by our community.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <MapPin 
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
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="form-select"
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Quick Filter Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button
              onClick={() => {
                setFilterCategory('');
                setFilterLocation('');
                setSearchTerm('');
              }}
              className={`btn btn-sm ${!filterCategory && !filterLocation && !searchTerm ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Memories
            </button>
            {categories.slice(0, 5).map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`btn btn-sm ${filterCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Memories Grid */}
        {publicMemories.length === 0 ? (
          <div className="card p-6 text-center">
            <Users size={48} style={{ margin: '0 auto 1rem', color: '#6b7280' }} />
            <h3 className="text-lg font-semibold mb-2">No memories found</h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory || filterLocation 
                ? 'Try adjusting your search filters.' 
                : 'No public memories have been shared yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicMemories.map(memory => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                onLike={handleLike}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {publicMemories.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-secondary">
              Load More Memories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMemories;
