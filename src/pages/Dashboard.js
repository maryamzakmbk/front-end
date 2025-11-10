import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMemory } from '../context/MemoryContext';
import Navbar from '../components/Common/Navbar';
import MemoryList from '../components/Creator/MemoryList';
import AddMemoryForm from '../components/Creator/AddMemoryForm';
import { Plus, Users, Image, Heart } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { memories } = useMemory();
  const [showAddMemory, setShowAddMemory] = useState(false);

  const userMemories = memories.filter(memory => memory.creatorId === currentUser.id);
  const publicMemories = memories.filter(memory => memory.privacy === 'public');
  const totalLikes = userMemories.reduce((sum, memory) => sum + (memory.likes || 0), 0);
  const totalComments = userMemories.reduce((sum, memory) => sum + (memory.comments ? memory.comments.length : 0), 0);

  const stats = [
    {
      title: 'Total Memories',
      value: userMemories.length,
      icon: Image,
      color: 'bg-blue-500'
    },
    {
      title: 'Public Memories',
      value: userMemories.filter(m => m.privacy === 'public').length,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Total Likes',
      value: totalLikes,
      icon: Heart,
      color: 'bg-pink-500'
    },
    {
      title: 'Total Comments',
      value: totalComments,
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Welcome Section */}
        <div className="card p-6 mb-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="text-2xl font-semibold mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-gray-500">
                Manage your memories and share your special moments.
              </p>
            </div>
            <button
              onClick={() => setShowAddMemory(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Add Memory
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '8px',
                  backgroundColor: stat.color.replace('bg-', '').split('-')[0] === 'blue' ? '#3b82f6' :
                                  stat.color.replace('bg-', '').split('-')[0] === 'green' ? '#10b981' :
                                  stat.color.replace('bg-', '').split('-')[0] === 'pink' ? '#ec4899' : '#8b5cf6',
                  color: 'white'
                }}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {publicMemories.slice(0, 3).map(memory => (
            <div key={memory.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '8px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                color: '#6b7280'
              }}>
                <Image size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="font-semibold">{memory.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(memory.date).toLocaleDateString()} • {memory.location}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Heart size={16} />
                  <span className="text-sm">{memory.likes || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Users size={16} />
                  <span className="text-sm">{memory.comments ? memory.comments.length : 0}</span>
                </div>
              </div>
            </div>
          ))}
          {publicMemories.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>

        {/* Memory List */}
        <MemoryList />

        {/* Add Memory Modal */}
        <AddMemoryForm
          isOpen={showAddMemory}
          onClose={() => setShowAddMemory(false)}
          onSuccess={() => console.log('Memory added successfully')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
