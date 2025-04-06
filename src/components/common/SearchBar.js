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

  // Button is disabled when input is empty or while searching
  const isButtonDisabled = !inputValue.trim() || isSearching || isLoading;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex rounded-full overflow-hidden border border-neutral-200 bg-white shadow-card hover:shadow-card-hover transition-shadow">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full pl-14 pr-4 py-4 text-base border-0 focus:outline-none focus:ring-0"
            aria-label="Search prompts"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isButtonDisabled}
          className={`px-8 py-4 flex items-center justify-center transition-colors ${
            isButtonDisabled 
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
          aria-label={isSearching ? "Searching" : "Search"}
        >
          {isSearching ? (
            <>
              <Loader size={18} className="mr-2 animate-spin" />
              <span className="font-medium">Searching...</span>
            </>
          ) : (
            <>
              <Search size={18} className="mr-2" />
              <span className="font-medium">Search</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;