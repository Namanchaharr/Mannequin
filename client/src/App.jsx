import React, { useState } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import CartButton from './components/CartButton';
import './App.css';

function App() {
  const [expandedId, setExpandedId] = useState(null);
  const [showTitle, setShowTitle] = useState(true);

  return (
    <div className="App">
      <Navbar showIcon={!!expandedId} showTitle={showTitle} />
      <CartButton visible={!!expandedId} />
      <Home
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        onScrollChange={(shouldShow) => setShowTitle(shouldShow)}
      />
    </div>
  );
}

export default App;
