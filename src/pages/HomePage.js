import React, { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterButtons from '../components/home/FilterButtons';
import PromptCollection from '../components/home/PromptCollection';
import WorkflowCollection from '../components/home/WorkflowCollection';
import SearchResults from '../components/home/SearchResults';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

const HomePage = () => {
  const { 
    recentlyUsedPrompts, 
    popularPrompts, 
    favorites,
    recentlyUsedWorkflows,
    popularWorkflows,
    favoriteWorkflows,
    searchQuery,
    openPlayground,
    openWorkflow
  } = useAppContext();
  
  // For demo purposes, we'll use a hardcoded username
  const [username] = useState('User');
  
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts' or 'workflows'

  // Navigate to workflow page 
  const navigateToWorkflow = () => {
    const event = new CustomEvent('navigateTo', { detail: { page: 'workflow' } });
    window.dispatchEvent(event);
  };

  // Navigate to playground for a new prompt
  const navigateToNewPrompt = () => {
    const event = new CustomEvent('navigateTo', { detail: { page: 'playground' } });
    window.dispatchEvent(event);
    openPlayground(null);
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header with welcome message and action buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-neutral-800">
          Welcome, {username}
        </h1>
        
        <div className="flex gap-4">
          <button 
            onClick={navigateToNewPrompt}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg transition-all hover:bg-primary-600"
          >
            <Plus size={18} />
            New Prompt
          </button>
          
          <button 
            onClick={navigateToWorkflow}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-lg transition-all hover:bg-purple-600"
          >
            <Plus size={18} />
            New Workflow
          </button>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-8">
        <div className="max-w-3xl mx-auto mb-6">
          <SearchBar />
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-4">
          <h3 className="text-neutral-700 font-medium">Filter prompts by:</h3>
          <FilterButtons />
        </div>
      </div>
            
      {/* Search Results - shown when there's a search query */}
      {searchQuery && (
        <div className="mb-8 animate-fade-in">
          <SearchResults searchQuery={searchQuery} />
        </div>
      )}
      
      {/* Tab Navigation - Improved Styling */}
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex">
          <button
            className={`py-3 px-8 font-medium text-base transition-all ${
              activeTab === 'prompts' 
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30' 
                : 'text-neutral-500 hover:text-neutral-700 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab('prompts')}
          >
            Prompts
          </button>
          <button
            className={`py-3 px-8 font-medium text-base transition-all ${
              activeTab === 'workflows' 
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30' 
                : 'text-neutral-500 hover:text-neutral-700 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab('workflows')}
          >
            Workflows
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="animate-fade-in">
        {/* PROMPTS SECTION */}
        {activeTab === 'prompts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-340px)]">
            <PromptCollection 
              title="Recently Used" 
              icon="clock"
              prompts={recentlyUsedPrompts} 
              type="recent"
            />
            
            <PromptCollection 
              title="Most Popular" 
              icon="trending"
              prompts={popularPrompts} 
              type="popular"
            />
            
            <PromptCollection 
              title="Favorites" 
              icon="star"
              prompts={favorites} 
              type="favorite"
            />
          </div>
        )}
        
        {/* WORKFLOWS SECTION */}
        {activeTab === 'workflows' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-340px)]">
            <WorkflowCollection 
              title="Recently Used" 
              icon="clock"
              workflows={recentlyUsedWorkflows} 
              type="recent"
            />
            
            <WorkflowCollection 
              title="Most Popular" 
              icon="trending"
              workflows={popularWorkflows} 
              type="popular"
            />
            
            <WorkflowCollection 
              title="Favorites" 
              icon="star"
              workflows={favoriteWorkflows} 
              type="favorite"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;