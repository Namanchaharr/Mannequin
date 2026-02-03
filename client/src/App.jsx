import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import CartButton from './components/CartButton';
import LoginModal from './components/LoginModal';
import './App.css';

function App() {
  const [expandedId, setExpandedId] = useState(null);
  const [showTitle, setShowTitle] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="App">
      <Navbar
        showIcon={!!expandedId}
        showTitle={showTitle}
        onProfileClick={handleProfileClick}
        isAuthenticated={isAuthenticated}
      />
      <CartButton visible={!!expandedId} />
      <Home
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        onScrollChange={(shouldShow) => setShowTitle(shouldShow)}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
