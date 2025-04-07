import React, { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterButtons from '../components/home/FilterButtons';
import PromptCollection from '../components/home/PromptCollection';
import SearchResults from '../components/home/SearchResults';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

const HomePage = () => {
  const { 
    recentlyUsedPrompts, 
    popularPrompts, 
    favorites,
    searchQuery,
    openPlayground // To navigate to playground
  } = useAppContext();
  
  // For demo purposes, we'll use a hardcoded username
  // In a real app, this would come from authentication context
  const [username] = useState('User');

  // Navigate to workflow page 
  const navigateToWorkflow = () => {
    // Looking at App.js, we need to dispatch a user event that will be caught by the parent component
    // The active page state is maintained in App.js, not in the context
    const event = new CustomEvent('navigateTo', { detail: { page: 'workflow' } });
    window.dispatchEvent(event);
  };

  // Navigate to playground for a new prompt
  const navigateToNewPrompt = () => {
    // We can either use the openPlayground function or use the same event-based approach
    // Let's use the event approach for consistency
    const event = new CustomEvent('navigateTo', { detail: { page: 'playground' } });
    window.dispatchEvent(event);
    
    // Clear any selected prompt for a fresh start
    // This should happen automatically in App.js handlePageChange, but let's be explicit
    openPlayground(null);
  };

  return (
    <div className="p-8 bg-neutral-50 min-h-screen">
      {/* Header with welcome message and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-neutral-800">
          Welcome, {username}
        </h1>
        
        <div className="flex gap-3">
          <button 
            onClick={navigateToNewPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors hover:bg-primary-600"
          >
            <Plus size={18} />
            New Prompt
          </button>
          
          <button 
            onClick={navigateToWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg transition-colors hover:bg-purple-600"
          >
            <Plus size={18} />
            New Workflow
          </button>
        </div>
      </div>
      
      {/* Top section with search bar */}
      <div className="mt-8 mb-6 animate-fade-in">
        <SearchBar />
      </div>
      
      {/* Filter section with text label */}
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center justify-center space-x-4">
          <h3 className="text-neutral-700 font-medium">Filter prompts by:</h3>
          <FilterButtons />
        </div>
      </div>
            
      {/* Search Results - shown when there's a search query */}
      {searchQuery && (
        <div className="mb-6 animate-fade-in">
          <SearchResults searchQuery={searchQuery} />
        </div>
      )}
      
      {/* Prompt Collections */}
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
    </div>
  );
};

export default HomePage;