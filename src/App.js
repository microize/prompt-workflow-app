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
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h1 className="text-xl font-semibold">Prompt History</h1>
        <p className="text-sm text-neutral-500 mt-1">View your previous prompt executions</p>
      </div>
      
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-neutral-700 mb-2">No history yet</h2>
        <p className="text-neutral-500 max-w-md">Your prompt execution history will be displayed here once you start using the playground.</p>
      </div>
    </div>
  </div>
);

const WorkflowLibraryPage = () => (
  <div className="p-8">
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h1 className="text-xl font-semibold">Workflow Library</h1>
        <p className="text-sm text-neutral-500 mt-1">Browse and manage your saved workflows</p>
      </div>
      
      <div className="p-6">
        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search workflows..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-neutral-700 mb-2">No workflows yet</h2>
          <p className="text-neutral-500 max-w-md">Workflows you create or save will appear here. Create a new workflow to get started.</p>
          
          <button className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Create New Workflow
          </button>
        </div>
      </div>
    </div>
  </div>
);

const JobsPage = () => (
  <div className="p-8">
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h1 className="text-xl font-semibold">Scheduled Jobs</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your automated workflow jobs</p>
      </div>
      
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-neutral-700 mb-2">No scheduled jobs</h2>
        <p className="text-neutral-500 max-w-md">You haven't scheduled any workflow jobs yet. Create a workflow and schedule it to run automatically.</p>
        
        <button className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          Create Job
        </button>
      </div>
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
    <div className="flex h-screen bg-neutral-50 p-2">
      {/* Removed padding from left side */}
      <div className={`${navCollapsed ? 'w-16' : 'w-64'} pl-0 mr-2`} style={{ marginLeft: 0 }}>
        <Navbar 
          navCollapsed={navCollapsed} 
          toggleNav={toggleNav}
          activePage={activePage}
          setActivePage={handlePageChange} 
        />
      </div>
      
      {/* Main content area with border and shadow */}
      <div className="flex-1 bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
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