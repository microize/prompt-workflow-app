import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import * as api from '../services/api';
import { recentlyUsedPrompts, initialFavorites } from '../data/samplePrompts';
import { sampleWorkflows } from '../data/sampleWorkflows';
import { recentlyUsedWorkflows, popularWorkflows, initialFavoriteWorkflows } from '../data/workflowData';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  // State variables for prompts
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [promptDatabase, setPromptDatabase] = useState([]);
  
  // State variables for workflows
  const [workflows, setWorkflows] = useState(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [favoriteWorkflows, setFavoriteWorkflows] = useState(initialFavoriteWorkflows);
  const [workflowSearchQuery, setWorkflowSearchQuery] = useState('');
  const [workflowSearchResults, setWorkflowSearchResults] = useState([]);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    web: false,
    design: false,
    writing: false,
    marketing: false
  });
  
  // Add state for active page to be passed in from App.js
  const [setActivePage, updateSetActivePage] = useState(() => () => {});

  // Method to set the page setter function from App.js
  const setPageSetter = useCallback((setter) => {
    updateSetActivePage(() => setter);
  }, []);

  // Derived state - memoize to prevent unnecessary recalculations
  const popularPrompts = useMemo(() => {
    return [...promptDatabase].sort((a, b) => b.usageCount - a.usageCount).slice(0, 10);
  }, [promptDatabase]);

  // Fetch prompts from API
  const fetchPrompts = useCallback(async () => {
    try {
      const data = await api.fetchPrompts();
      setPromptDatabase(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  }, []);

  // Functions for prompts
  const openPlayground = useCallback((prompt) => {
    setSelectedPrompt(prompt);
    if (prompt) {
      setPlaygroundInput(prompt.text);
    }
    // Now we can change the active page by calling the setter passed from App.js
    setActivePage('playground');
  }, [setActivePage]);
  
  const handleFilterClick = useCallback((filter) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [filter]: !prevFilters[filter]
    }));
  }, []);

  // Updated toggleFavorite to use API
  const toggleFavorite = useCallback(async (prompt) => {
    try {
      await api.togglePromptFavorite(prompt.id);
      setFavorites(prevFavorites => {
        const isFavorite = prevFavorites.some(f => f.id === prompt.id);
        if (isFavorite) {
          return prevFavorites.filter(f => f.id !== prompt.id);
        } else {
          return [...prevFavorites, prompt];
        }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, []);

  // Functions for workflows
  const openWorkflow = useCallback((workflow) => {
    setSelectedWorkflow(workflow);
    // Change the active page to workflow editor
    setActivePage('workflow');
    
    // Add to recently used if not already at the top
    if (workflow) {
      setWorkflows(prevWorkflows => {
        // Remove the workflow if it's already in the list to avoid duplicates
        const filteredWorkflows = prevWorkflows.filter(w => w.id !== workflow.id);
        // Add the workflow to the top of the list with updated lastUsed
        return [
          { 
            ...workflow, 
            lastUsed: 'Just now',
            usageCount: (workflow.usageCount || 0) + 1
          },
          ...filteredWorkflows
        ];
      });
    }
  }, [setActivePage]);

  const toggleFavoriteWorkflow = useCallback((workflow) => {
    setFavoriteWorkflows(prevFavorites => {
      const isFavorite = prevFavorites.some(f => f.id === workflow.id);
      if (isFavorite) {
        return prevFavorites.filter(f => f.id !== workflow.id);
      } else {
        const currentDate = new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        
        return [...prevFavorites, {
          ...workflow,
          addedAt: currentDate
        }];
      }
    });
  }, []);

  // Updated search logic - now triggered when searchQuery changes
  // This is automatically called when the SearchBar component updates the searchQuery
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    // Set loading state
    setIsLoading(true);
    
    // Simulate AJAX request with a delayed response
    const fetchResults = async () => {
      try {
        // In a real app, this would be an API call
        // We add a delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter results based on query and active filters
        const filteredResults = promptDatabase.filter(prompt => {
          const matchesQuery = prompt.text.toLowerCase().includes(searchQuery.toLowerCase());
          const anyFilterActive = Object.values(activeFilters).some(value => value);
          const matchesFilter = !anyFilterActive || activeFilters[prompt.category];
          return matchesQuery && matchesFilter;
        });
        
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        // In a real app, you might want to set an error state here
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use a cleanup function to handle component unmounting
    // or rapid changes to the search query
    const timeoutId = setTimeout(fetchResults, 300);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, activeFilters, promptDatabase]);

  React.useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Fetch additional data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentData, popularData, favoritesData] = await Promise.all([
          api.fetchRecentPrompts(),
          api.fetchPopularPrompts(),
          api.fetchFavoritePrompts()
        ]);

        setPromptDatabase(recentData); // Assuming recent prompts update the database
        setFavorites(favoritesData);
        // Optionally update popular prompts if needed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Value object to provide through context - memoize to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // Data - Prompts
    promptDatabase,
    recentlyUsedPrompts,
    popularPrompts,
    favorites,
    
    // Data - Workflows
    workflows,
    recentlyUsedWorkflows,
    popularWorkflows,
    favoriteWorkflows,
    
    // Search and filters state - Prompts
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    activeFilters,
    
    // Search state - Workflows
    workflowSearchQuery,
    setWorkflowSearchQuery,
    workflowSearchResults,
    isWorkflowLoading,
    
    // Playground state
    selectedPrompt,
    setSelectedPrompt,
    playgroundInput,
    setPlaygroundInput,
    
    // Workflow state
    selectedWorkflow,
    setSelectedWorkflow,
    
    // Page navigation
    setPageSetter,
    
    // Functions - Prompts
    openPlayground,
    handleFilterClick,
    toggleFavorite,
    
    // Functions - Workflows
    openWorkflow,
    toggleFavoriteWorkflow
  }), [
    // Prompts dependencies
    promptDatabase, favorites, searchQuery, searchResults, isLoading, activeFilters,
    selectedPrompt, playgroundInput, openPlayground,
    handleFilterClick, toggleFavorite, popularPrompts,
    
    // Workflows dependencies
    workflows, favoriteWorkflows, workflowSearchQuery, workflowSearchResults, 
    isWorkflowLoading, selectedWorkflow, openWorkflow, toggleFavoriteWorkflow
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;