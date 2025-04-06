import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import WorkflowPage from './pages/WorkflowPage';
import SettingsPage from './pages/SettingsPage';
import './styles/global.css';

const AppContent = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const { setPageSetter, setSelectedPrompt, setPlaygroundInput } = useAppContext();

  // Effect to register the setActivePage function with the context
  useEffect(() => {
    setPageSetter(setActivePage);
  }, [setPageSetter]);

  // Handle direct navigation to playground
  const handlePageChange = (page) => {
    // If navigating directly to playground, clear the selected prompt
    if (page === 'playground' && activePage !== 'playground') {
      // Only clear if this is not coming from a prompt card
      if (!document.activeElement.classList.contains('prompt-try-button')) {
        setSelectedPrompt(null);
        setPlaygroundInput('');
      }
    }
    
    setActivePage(page);
  };

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
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <Navbar 
        navCollapsed={navCollapsed} 
        toggleNav={toggleNav}
        activePage={activePage}
        setActivePage={handlePageChange} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;