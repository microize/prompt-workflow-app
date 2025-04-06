import React, { createContext, useState, useContext, useCallback } from 'react';
import { promptDatabase, recentlyUsedPrompts, initialFavorites } from '../data/samplePrompts';
import { sampleWorkflows } from '../data/sampleWorkflows';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

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

  // Derived state
  const popularPrompts = [...promptDatabase].sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);

  // Functions
  const openPlayground = (prompt) => {
    setSelectedPrompt(prompt);
    // Note: We'll need to pass activePage setter from App.js to this context or handle another way
  };
  
  const handleFilterClick = (filter) => {
    setActiveFilters({
      ...activeFilters,
      [filter]: !activeFilters[filter]
    });
  };

  const toggleFavorite = (prompt) => {
    const isFavorite = favorites.some(f => f.id === prompt.id);
    if (isFavorite) {
      setFavorites(favorites.filter(f => f.id !== prompt.id));
    } else {
      setFavorites([...favorites, {
        ...prompt,
        addedAt: "Today"
      }]);
    }
  };

  // Updated search logic - now triggered when searchQuery changes
  // This is automatically called when the SearchBar component updates the searchQuery
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Set loading state
    setIsLoading(true);
    
    // Simulate AJAX request
    const fetchResults = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [searchQuery, activeFilters]);

  // Value object to provide through context
  const value = {
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
    
    // Functions
    openPlayground,
    handleFilterClick,
    toggleFavorite
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;