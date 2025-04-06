import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const SearchBar = () => {
  const { setSearchQuery, isLoading } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle search with AJAX-style functionality
  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Simulate AJAX request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the global search query after "AJAX" completes
      setSearchQuery(inputValue);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full pl-12 pr-4 py-4 text-lg rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-lg flex items-center justify-center transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <Loader size={20} className="mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search size={20} className="mr-2" />
              Search
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;