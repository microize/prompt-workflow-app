import { useState, useCallback, useEffect } from 'react';
import { initialFavorites } from '../data/samplePrompts';

/**
 * Custom hook for managing favorite prompts
 * 
 * Provides functionality to add, remove, and persist favorites
 */
export const useFavorites = (initialState = initialFavorites) => {
  // Initialize state from localStorage if available
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem('promptAppFavorites');
      return storedFavorites ? JSON.parse(storedFavorites) : initialState;
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return initialState;
    }
  });

  // Persist favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('promptAppFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((prompt) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(f => f.id === prompt.id);
      if (isFavorite) {
        return prevFavorites.filter(f => f.id !== prompt.id);
      } else {
        const currentDate = new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        
        return [...prevFavorites, {
          ...prompt,
          addedAt: currentDate
        }];
      }
    });
  }, []);

  // Check if a prompt is favorited
  const isFavorite = useCallback((promptId) => {
    return favorites.some(f => f.id === promptId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      setFavorites([]);
    }
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
};

export default useFavorites;