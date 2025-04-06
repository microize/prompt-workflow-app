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
      <h1 className="text-2xl font-semibold mb-1 text-[#1d1d1f]">Prompt Search</h1>
      <p className="text-[#86868b] mb-8">Find and use AI prompts for your projects</p>
      
      {/* Search Bar */}
      <SearchBar />

      {/* Filter Buttons */}
      <FilterButtons />

      {/* Search Results - shown when there's a search query */}
      {searchQuery && (
        <div className="mb-10">
          <SearchResults searchQuery={searchQuery} />
        </div>
      )}
      
      
      {/* Prompt Collections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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