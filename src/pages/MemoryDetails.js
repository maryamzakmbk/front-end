import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemory } from '../context/MemoryContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Common/Navbar';
import { ArrowLeft, Heart, MessageCircle, Share, MapPin, Calendar, Tag, User } from 'lucide-react';

const MemoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { memories, users, likeMemory, addComment } = useMemory();
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const memory = memories.find(m => m.id === parseInt(id));
  
  if (!memory) {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="alert alert-error">
            Memory not found.
          </div>
        </div>
      </div>
    );
  }

  const creator = users.find(u => u.id === memory.creatorId);
  const isLiked = currentUser && memory.likedBy && memory.likedBy.includes(currentUser.id);

  const handleLike = () => {
    if (currentUser) {
      likeMemory(memory.id, currentUser.id);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addComment(memory.id, {
        userId: currentUser.id,
        text: comment
      });
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Memory Media */}
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}>
                {memory.media && memory.media.length > 0 ? (
                  <img 
                    src={memory.media[0]} 
                    alt={memory.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <p>No media available</p>
                  </div>
                )}
              </div>

              {/* Memory Content */}
              <div className="p-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h1 className="text-2xl font-semibold">{memory.title}</h1>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleLike}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        backgroundColor: isLiked ? '#fdf2f8' : '#f3f4f6',
                        color: isLiked ? '#ec4899' : '#6b7280',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={18} fill={isLiked ? '#ec4899' : 'none'} />
                      <span>{memory.likes || 0}</span>
                    </button>
                    
                    <button
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Share size={18} />
                      Share
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{memory.description}</p>

                {/* Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  {memory.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} color="#6b7280" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{new Date(memory.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {memory.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} color="#6b7280" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{memory.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {memory.category && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Tag size={18} color="#6b7280" />
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{memory.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {memory.tags && memory.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {memory.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            color: '#6b7280'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle size={20} />
                    Comments ({memory.comments ? memory.comments.length : 0})
                  </h3>

                  {/* Add Comment */}
                  {currentUser && (
                    <form onSubmit={handleComment} className="mb-6">
                      <div className="form-group">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="form-textarea"
                          rows="3"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !comment.trim()}
                        className="btn btn-primary"
                      >
                        {loading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </form>
                  )}

                  {/* Comments List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {memory.comments && memory.comments.length > 0 ? (
                      memory.comments.map(comment => {
                        const commentUser = users.find(u => u.id === comment.userId);
                        return (
                          <div key={comment.id} style={{ 
                            padding: '1rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              <div style={{
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '50%',
                                backgroundColor: '#6366f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.75rem'
                              }}>
                                {commentUser ? commentUser.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {commentUser ? commentUser.name : 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(comment.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Creator Info */}
            <div className="card p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User size={18} />
                About the Creator
              </h3>
              
              {creator ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1.125rem'
                  }}>
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{creator.name}</p>
                    <p className="text-sm text-gray-500">{creator.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(creator.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Creator information not available</p>
              )}
              
              {currentUser && creator && currentUser.id !== creator.id && (
                <button className="btn btn-primary w-full mt-4">
                  Follow
                </button>
              )}
            </div>

            {/* Related Memories */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Related Memories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {memories
                  .filter(m => 
                    m.id !== memory.id && 
                    m.privacy === 'public' && 
                    (m.category === memory.category || 
                     m.tags.some(tag => memory.tags.includes(tag)))
                  )
                  .slice(0, 3)
                  .map(relatedMemory => (
                    <Link
                      key={relatedMemory.id}
                      to={`/memory/${relatedMemory.id}`}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <div style={{
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '8px',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        flexShrink: 0
                      }}>
                        📷
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="font-medium text-sm">{relatedMemory.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(relatedMemory.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                
                {memories.filter(m => 
                  m.id !== memory.id && 
                  m.privacy === 'public' && 
                  (m.category === memory.category || 
                   m.tags.some(tag => memory.tags.includes(tag)))
                ).length === 0 && (
                  <p className="text-gray-500 text-sm">No related memories found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetails;
