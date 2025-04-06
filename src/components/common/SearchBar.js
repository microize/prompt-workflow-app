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
    <div className="max-w-3xl mx-auto mb-10">
      <div className="flex rounded-full overflow-hidden border border-gray-200 bg-white">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full pl-14 pr-4 py-3 text-base border-0 focus:outline-none focus:ring-0"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !inputValue.trim()}
          className="bg-[#4285f4] hover:bg-[#3367d6] text-white px-8 py-3 flex items-center justify-center transition-colors disabled:bg-[#a1c2fa] disabled:cursor-not-allowed"
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