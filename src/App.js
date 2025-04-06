import React, { useState } from 'react';
import { AppContextProvider } from './context/AppContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import WorkflowPage from './pages/WorkflowPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const App = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const toggleNav = () => setNavCollapsed(!navCollapsed);

  // Render the appropriate page based on activePage state
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'playground':
        return <PlaygroundPage />;
      case 'workflow':
        return <WorkflowPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContextProvider>
      <div className="flex h-screen bg-gray-100">
        <Navbar 
          navCollapsed={navCollapsed} 
          toggleNav={toggleNav}
          activePage={activePage}
          setActivePage={setActivePage} 
        />
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </AppContextProvider>
  );
};

export default App;