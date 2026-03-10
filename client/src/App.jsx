import React, { useState } from 'react';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [expandedId, setExpandedId] = useState(null);
  const [showTitle, setShowTitle] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);



  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackFromCategory = () => {
    setSelectedCategory(null);
  };

  // If a category is selected, show the category view
  if (selectedCategory) {
    return (
      <div className="App">
        <CategoryView
          category={selectedCategory}
          onBack={handleBackFromCategory}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar
        showIcon={false}
        showTitle={showTitle}
        onProfileClick={() => {}}
        isAuthenticated={false}
      />
      <Home
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        onScrollChange={(shouldShow) => setShowTitle(shouldShow)}
        showOutlines={false}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
}

export default App;
