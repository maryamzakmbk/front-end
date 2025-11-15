import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Camera, LogOut, User, Home, Users, Settings } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="logo">
            <Camera size={24} />
            MemoryVault
          </Link>
          
          {currentUser && (
            <div className="nav-links">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <Home size={18} />
                Dashboard
              </Link>
              
              <Link 
                to="/public" 
                className={`nav-link ${isActive('/public') ? 'active' : ''}`}
              >
                <Users size={18} />
                Public Memories
              </Link>
              
              {currentUser.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  <Settings size={18} />
                  Admin
                </Link>
              )}
              
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <User size={18} />
                Profile
              </Link>
              
              <button 
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
