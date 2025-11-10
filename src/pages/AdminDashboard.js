import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMemory } from '../context/MemoryContext';
import Navbar from '../components/Common/Navbar';
import { Users, Image, Settings, Shield, Bell, Search } from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { memories, users } = useMemory();
  const [activeTab, setActiveTab] = useState('overview');

  if (currentUser.role !== 'admin') {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="alert alert-error">
            Access denied. Admin privileges required.
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Memories',
      value: memories.length,
      icon: Image,
      color: 'bg-green-500'
    },
    {
      title: 'Public Memories',
      value: memories.filter(m => m.privacy === 'public').length,
      icon: Image,
      color: 'bg-purple-500'
    },
    {
      title: 'Private Memories',
      value: memories.filter(m => m.privacy === 'private').length,
      icon: Shield,
      color: 'bg-red-500'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Users },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'content', name: 'Content Management', icon: Image },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <div className="card p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">
            Manage users, content, and platform settings.
          </p>
        </div>

        {/* Stats */}
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
                                  stat.color.replace('bg-', '').split('-')[0] === 'purple' ? '#8b5cf6' : '#ef4444',
                  color: 'white'
                }}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs and Content */}
        <div className="card">
          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb',
            overflowX: 'auto'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.5rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                  color: activeTab === tab.id ? '#6366f1' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-4">
                    <h3 className="font-semibold mb-3">Recent Users</h3>
                    {users.slice(0, 5).map(user => (
                      <div key={user.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '0.75rem 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: user.role === 'admin' ? '#ef4444' : '#10b981',
                          color: 'white'
                        }}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="card p-4">
                    <h3 className="font-semibold mb-3">Recent Memories</h3>
                    {memories.slice(0, 5).map(memory => (
                      <div key={memory.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '0.75rem 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '8px',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem',
                          color: '#6b7280'
                        }}>
                          <Image size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="font-medium">{memory.title}</p>
                          <p className="text-sm text-gray-500">
                            By {users.find(u => u.id === memory.creatorId)?.name || 'Unknown'}
                          </p>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: memory.privacy === 'public' ? '#10b981' : '#6b7280',
                          color: 'white'
                        }}>
                          {memory.privacy}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
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
                      placeholder="Search users..."
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                  <button className="btn btn-primary">
                    <Users size={18} />
                    Invite User
                  </button>
                </div>
                
                <div className="card">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>User</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Role</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Memories</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                backgroundColor: '#6366f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '600'
                              }}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              backgroundColor: user.role === 'admin' ? '#ef4444' : '#10b981',
                              color: 'white'
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {memories.filter(m => m.creatorId === user.id).length}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              backgroundColor: '#10b981',
                              color: 'white'
                            }}>
                              Active
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-sm btn-secondary">
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs would have similar content structures */}
            {activeTab !== 'overview' && activeTab !== 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <p className="text-gray-500">
                  This section is under development. More features coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
