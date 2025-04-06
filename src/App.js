import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import WorkflowPage from './pages/WorkflowPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const AppContent = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const { setPageSetter } = useAppContext();

  // Effect to register the setActivePage function with the context
  useEffect(() => {
    setPageSetter(setActivePage);
  }, [setPageSetter]);

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