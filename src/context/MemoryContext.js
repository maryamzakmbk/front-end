import React, { createContext, useState, useContext, useEffect } from 'react';

const MemoryContext = createContext();

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load initial data from localStorage
    const savedMemories = localStorage.getItem('memories');
    const savedUsers = localStorage.getItem('users');
    
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    } else {
      // Sample data
      const initialMemories = [
        {
          id: 1,
          title: "Graduation Day",
          description: "Celebrating my graduation with family and friends",
          media: ["graduation.jpg"],
          date: "2023-05-15",
          location: "University Campus",
          tags: ["graduation", "celebration", "family"],
          privacy: "public",
          creatorId: 1,
          likes: 15,
          comments: [
            { id: 1, userId: 2, text: "Congratulations!", date: "2023-05-16" }
          ],
          category: "Education"
        },
        {
          id: 2,
          title: "Beach Vacation",
          description: "Amazing time at the beach with friends",
          media: ["beach1.jpg", "beach2.jpg"],
          date: "2023-07-20",
          location: "Sunset Beach",
          tags: ["vacation", "beach", "friends"],
          privacy: "public",
          creatorId: 2,
          likes: 8,
          comments: [],
          category: "Travel"
        }
      ];
      setMemories(initialMemories);
      localStorage.setItem('memories', JSON.stringify(initialMemories));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "creator", followers: [2, 3] },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "creator", followers: [1] },
        { id: 3, name: "Admin User", email: "admin@example.com", role: "admin", followers: [] }
      ];
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const addMemory = (memory) => {
    const newMemory = {
      ...memory,
      id: Date.now(),
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));
    return newMemory;
  };

  const updateMemory = (id, updates) => {
    const updatedMemories = memories.map(memory =>
      memory.id === id ? { ...memory, ...updates } : memory
    );
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));
  };

  const deleteMemory = (id) => {
    const updatedMemories = memories.filter(memory => memory.id !== id);
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));
  };

  const addComment = (memoryId, comment) => {
    const newComment = {
      id: Date.now(),
      ...comment,
      date: new Date().toISOString()
    };
    
    const updatedMemories = memories.map(memory =>
      memory.id === memoryId
        ? { ...memory, comments: [...memory.comments, newComment] }
        : memory
    );
    
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));
  };

  const likeMemory = (memoryId, userId) => {
    const updatedMemories = memories.map(memory => {
      if (memory.id === memoryId) {
        // Check if user already liked
        const hasLiked = memory.likedBy && memory.likedBy.includes(userId);
        return {
          ...memory,
          likes: hasLiked ? memory.likes - 1 : memory.likes + 1,
          likedBy: hasLiked 
            ? memory.likedBy.filter(id => id !== userId)
            : [...(memory.likedBy || []), userId]
        };
      }
      return memory;
    });
    
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now(),
      followers: []
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return newUser;
  };

  const followUser = (followerId, followingId) => {
    const updatedUsers = users.map(user => {
      if (user.id === followerId) {
        const isFollowing = user.following && user.following.includes(followingId);
        return {
          ...user,
          following: isFollowing
            ? user.following.filter(id => id !== followingId)
            : [...(user.following || []), followingId]
        };
      }
      if (user.id === followingId) {
        const isFollowed = user.followers && user.followers.includes(followerId);
        return {
          ...user,
          followers: isFollowed
            ? user.followers.filter(id => id !== followerId)
            : [...(user.followers || []), followerId]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const value = {
    memories,
    users,
    addMemory,
    updateMemory,
    deleteMemory,
    addComment,
    likeMemory,
    addUser,
    followUser
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
};
