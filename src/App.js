import React, { useState, useEffect } from 'react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import WorkflowPage from './pages/WorkflowPage';
import SettingsPage from './pages/SettingsPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import './styles/global.css';

const PromptHistoryPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-6">Prompt History</h1>
    <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
      <p className="text-center text-neutral-500">Your prompt execution history will be displayed here</p>
    </div>
  </div>
);

const WorkflowLibraryPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-6">Workflow Library</h1>
    <div className="max-w-3xl mx-auto mb-6">
      <input 
        type="text" 
        placeholder="Search workflows..." 
        className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
    <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
      <p className="text-center text-neutral-500">Workflow library content will be displayed here</p>
    </div>
  </div>
);

const JobsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-6">Scheduled Jobs</h1>
    <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
      <p className="text-center text-neutral-500">Your scheduled workflow jobs will be displayed here</p>
    </div>
  </div>
);

const AppContent = () => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const { setPageSetter, setSelectedPrompt, setPlaygroundInput } = useAppContext();

  // Effect to register the setActivePage function with the context
  useEffect(() => {
    setPageSetter(setActivePage);
  }, [setPageSetter]);

  // Add event listener for navigation events from child components
  useEffect(() => {
    const handleNavigationEvent = (event) => {
      if (event.detail && event.detail.page) {
        handlePageChange(event.detail.page);
      }
    };
    
    window.addEventListener('navigateTo', handleNavigationEvent);
    
    return () => {
      window.removeEventListener('navigateTo', handleNavigationEvent);
    };
  }, []);

  // Handle direct navigation to playground
  const handlePageChange = (page) => {
    // If navigating directly to playground, clear the selected prompt
    if (page === 'playground' && activePage !== 'playground') {
      // Only clear if this is not coming from a prompt card
      if (!document.activeElement || !document.activeElement.classList.contains('prompt-try-button')) {
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
      case 'prompt_library':
        return <PromptLibraryPage />;
      case 'prompt_history':
        return <PromptHistoryPage />;
      case 'workflow':
        return <WorkflowPage />;
      case 'workflow_library':
        return <WorkflowLibraryPage />;
      case 'jobs':
        return <JobsPage />;
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