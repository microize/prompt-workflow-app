import { useState, useEffect, useCallback, useMemo } from 'react';
import { promptDatabase } from '../data/samplePrompts';

/**
 * Custom hook for searching and filtering prompts
 * 
 * @param {Array} prompts - Array of prompts to search through (defaults to promptDatabase)
 * @returns {Object} Search state and functions
 */
export const usePromptSearch = (prompts = promptDatabase) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    web: false,
    design: false,
    writing: false,
    marketing: false,
    business: false,
    development: false
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle toggling a filter
  const handleFilterClick = useCallback((filter) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [filter]: !prevFilters[filter]
    }));
  }, []);

  // Clear all active filters
  const clearFilters = useCallback(() => {
    setActiveFilters(Object.keys(activeFilters).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {}));
  }, [activeFilters]);

  // Get array of currently active filter names
  const activeFilterNames = useMemo(() => {
    return Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([name]) => name);
  }, [activeFilters]);

  // Search and filter logic
  useEffect(() => {
    if (!searchQuery.trim() && !activeFilterNames.length) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    // Set loading state
    setIsLoading(true);
    
    // Simulate AJAX request with a delayed response
    const timeoutId = setTimeout(() => {
      try {
        // Filter results based on query and active filters
        const filteredResults = prompts.filter(prompt => {
          const matchesQuery = !searchQuery.trim() || 
            prompt.text.toLowerCase().includes(searchQuery.toLowerCase());
          
          const anyFilterActive = activeFilterNames.length > 0;
          const matchesFilter = !anyFilterActive || activeFilters[prompt.category];
          
          return matchesQuery && matchesFilter;
        });
        
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error filtering search results:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeFilters, activeFilterNames.length, prompts]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    handleFilterClick,
    clearFilters,
    activeFilterNames,
    searchResults,
    isLoading
  };
};

export default usePromptSearch;