import React from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterButtons from '../components/home/FilterButtons';
import PromptCollection from '../components/home/PromptCollection';
import SearchResults from '../components/home/SearchResults';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const { 
    recentlyUsedPrompts, 
    popularPrompts, 
    favorites,
    searchQuery
  } = useAppContext();

  return (
    <div className="p-8 bg-[#f5f5f7] min-h-screen">
      {/* Significant top margin for content to start lower */}
      <div className="mt-12">
        {/* Search Bar with improved vertical spacing */}
        <SearchBar />
      </div>
      
      {/* Filter section with text label for clarity */}
      <div className="mb-6 mt-4">
        <div className="flex items-center justify-center space-x-4">
        <h3 className="text-[#3c4043] font-medium">Filter prompts by:</h3>
        <FilterButtons />
        </div>
      </div>
            
      {/* Search Results - shown when there's a search query */}
      {searchQuery && (
        <div className="mb-6 mt-4">
          <SearchResults searchQuery={searchQuery} />
        </div>
      )}
      

      {/* Prompt Collections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-8">
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