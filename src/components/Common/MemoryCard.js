import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, MapPin, Tag } from 'lucide-react';

const MemoryCard = ({ memory, onLike, showActions = true }) => {
  const handleLike = (e) => {
    e.preventDefault();
    if (onLike) {
      onLike(memory.id);
    }
  };

  return (
    <div className="memory-card">
      <div className="memory-media">
        {memory.media && memory.media.length > 0 ? (
          <img 
            src={memory.media[0]} 
            alt={memory.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6',
            color: '#6b7280'
          }}>
            <Camera size={48} />
          </div>
        )}
      </div>
      
      <div className="memory-content">
        <Link to={`/memory/${memory.id}`}>
          <h3 className="memory-title">{memory.title}</h3>
        </Link>
        
        <p className="memory-description">{memory.description}</p>
        
        <div className="memory-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            <span>{new Date(memory.date).toLocaleDateString()}</span>
          </div>
          
          {memory.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} />
              <span>{memory.location}</span>
            </div>
          )}
        </div>
        
        {memory.tags && memory.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
            {memory.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {showActions && (
          <div className="memory-actions">
            <button 
              onClick={handleLike}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                padding: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: memory.likedBy && memory.likedBy.includes(1) ? '#ec4899' : '#6b7280',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <Heart size={18} fill={memory.likedBy && memory.likedBy.includes(1) ? '#ec4899' : 'none'} />
              <span>{memory.likes || 0}</span>
            </button>
            
            <Link 
              to={`/memory/${memory.id}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                padding: '0.5rem',
                color: '#6b7280',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              <MessageCircle size={18} />
              <span>{memory.comments ? memory.comments.length : 0}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryCard;
