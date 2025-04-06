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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Prompt Search</h1>
      
      {/* Search Bar */}
      <SearchBar />
      
      {/* Search Results - shown when there's a search query */}
      {searchQuery && (
        <div className="mb-8">
          <SearchResults searchQuery={searchQuery} />
        </div>
      )}
      
      {/* Prompt Collections - only shown when not searching */}
      {!searchQuery && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          
          {/* Filter Buttons - only shown when not searching */}
          <FilterButtons />
        </>
      )}
    </div>
  );
};

export default HomePage;