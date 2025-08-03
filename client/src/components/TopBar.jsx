import React, { useState } from 'react';
import './TopBar.css';
import AuthModal from './AuthModal';
import symbolImg from '../assets/symbol.png';

const TopBar = ({ user, logout, login, onHomeClick, searchTerm, setSearchTerm }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginSuccess = (userData) => {
    login(userData);
    setShowAuthModal(false);
  };

  return (
    <>
      <div className={`page-content ${showAuthModal ? 'blurred' : ''}`}>
        <div className="top-bar">
          <div className="logo-home" onClick={onHomeClick}>
            <img src={symbolImg} alt="Detective Symbol" style={{ height: '40px', marginRight: '10px' }} />
            <button className="home-button">Home</button>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="auth-buttons">
            {user ? (
              <>
                <span className="welcome-message">Hello, {user.username}</span>
                <button onClick={logout} className="logout-button">Logout</button>
              </>
            ) : (
              <button className="login-button" onClick={() => setShowAuthModal(true)}>
                Log In/Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default TopBar;
