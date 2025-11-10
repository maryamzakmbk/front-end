import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMemory } from '../context/MemoryContext';
import Navbar from '../components/Common/Navbar';
import MemoryCard from '../components/Common/MemoryCard';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const { memories } = useMemory();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || ''
  });

  const userMemories = memories.filter(memory => memory.creatorId === currentUser?.id);
  const publicMemories = userMemories.filter(memory => memory.privacy === 'public');
  const privateMemories = userMemories.filter(memory => memory.privacy === 'private');

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    setIsEditing(false);
    // Update current user context with new data
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      bio: currentUser?.bio || ''
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Profile Header */}
        <div className="card p-6 mb-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '50%',
                backgroundColor: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '2rem'
              }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              
              <div>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      style={{ fontSize: '1.5rem', fontWeight: '600' }}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-semibold">{currentUser.name}</h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                      <Mail size={16} />
                      {currentUser.email}
                    </p>
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                      <Calendar size={16} />
                      Joined {new Date(currentUser.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleSave} className="btn btn-primary">
                    <Save size={18} />
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn btn-secondary">
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                  <Edit size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <User size={18} />
              About
            </h3>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="form-textarea"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            ) : (
              <p className="text-gray-600">
                {currentUser.bio || 'No bio provided.'}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card p-6 text-center">
            <div className="text-2xl font-semibold text-blue-600">{userMemories.length}</div>
            <div className="text-gray-500">Total Memories</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-semibold text-green-600">{publicMemories.length}</div>
            <div className="text-gray-500">Public Memories</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-semibold text-purple-600">{privateMemories.length}</div>
            <div className="text-gray-500">Private Memories</div>
          </div>
        </div>

        {/* Memories */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">My Memories</h2>
          
          {userMemories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any memories yet.</p>
              <button className="btn btn-primary">
                Create Your First Memory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userMemories.map(memory => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
