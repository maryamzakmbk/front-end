import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // In a real app, this would be an API call
    const user = {
      id: Date.now(),
      email,
      role,
      name: email.split('@')[0],
      joinDate: new Date().toISOString()
    };
    
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const register = (name, email, password, role) => {
    // In a real app, this would be an API call
    const user = {
      id: Date.now(),
      name,
      email,
      role,
      joinDate: new Date().toISOString()
    };
    
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
