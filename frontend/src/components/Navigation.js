import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/dashboard" style={{fontSize: '1.5em', fontWeight: 'bold', color: '#667eea'}}>StudyBuddy</Link>
        
        {user ? (
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/groups">Groups</Link>
            <Link to="/sessions">Sessions</Link>
            <Link to="/memberships">My Groups</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/profile">Profile</Link>
            <div className="theme-toggle">
              <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                <span className="slider"></span>
              </label>
            </div>
            <span style={{color: '#667eea', marginRight: '10px'}}>Hi, {user.username}!</span>
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="nav-links">
            <div className="theme-toggle">
              <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                <span className="slider"></span>
              </label>
            </div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
