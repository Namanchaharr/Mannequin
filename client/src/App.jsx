import React, { useState } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [uiVisible, setUiVisible] = useState(false);

  return (
    <div className="App">
      <Navbar visible={uiVisible} />
      <Home onInteract={() => setUiVisible(true)} />
    </div>
  );
}

export default App;
