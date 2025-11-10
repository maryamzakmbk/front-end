import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MemoryProvider } from './context/MemoryContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import MemoryDetails from './pages/MemoryDetails';
import Profile from './pages/Profile';
import PublicMemories from './pages/PublicMemories';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <MemoryProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/memory/:id" element={<MemoryDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/public" element={<PublicMemories />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </MemoryProvider>
    </AuthProvider>
  );
}

export default App;
