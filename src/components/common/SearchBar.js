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
      <div className="flex rounded-full overflow-hidden border border-gray-200 bg-white">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full pl-14 pr-4 py-4 text-base border-0 focus:outline-none focus:ring-0"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isButtonDisabled}
          className={`px-8 py-4 flex items-center justify-center transition-colors ${
            isButtonDisabled 
              ? 'bg-[#dadce0] text-[#9aa0a6] cursor-not-allowed' 
              : 'bg-[#4285f4] hover:bg-[#3367d6] text-white'
          }`}
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