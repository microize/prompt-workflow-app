import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { promptDatabase, recentlyUsedPrompts, initialFavorites } from '../data/samplePrompts';
import { sampleWorkflows } from '../data/sampleWorkflows';

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
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [workflows, setWorkflows] = useState(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
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
  }, []);

  // Functions
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

  const toggleFavorite = useCallback((prompt) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(f => f.id === prompt.id);
      if (isFavorite) {
        return prevFavorites.filter(f => f.id !== prompt.id);
      } else {
        return [...prevFavorites, {
          ...prompt,
          addedAt: "Today"
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
  }, [searchQuery, activeFilters]);

  // Value object to provide through context - memoize to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // Data
    promptDatabase,
    recentlyUsedPrompts,
    popularPrompts,
    favorites,
    workflows,
    
    // Search and filters state
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    activeFilters,
    
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
    
    // Functions
    openPlayground,
    handleFilterClick,
    toggleFavorite
  }), [
    favorites, workflows, searchQuery, searchResults, isLoading, activeFilters,
    selectedPrompt, playgroundInput, selectedWorkflow, openPlayground,
    handleFilterClick, toggleFavorite, popularPrompts
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;