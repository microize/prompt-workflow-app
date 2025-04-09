import React from 'react';
import { PlayCircle, Star, Loader } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Badge from '../common/Badge';

const SearchResults = ({ searchQuery }) => {
  const { searchResults, isLoading, openPlayground, toggleFavorite, favorites } = useAppContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="text-[17px] font-medium text-neutral-700">Results</h2>
          <p className="text-sm text-neutral-600">Searching for "{searchQuery}"...</p>
        </div>
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader className="h-8 w-8 text-primary-500 animate-spin mb-4" />
          <p className="text-neutral-600">Searching prompts...</p>
        </div>
      </div>
    );
  }

  // Empty state - no search results
  if (searchResults.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="text-[17px] font-medium text-neutral-700">Results</h2>
          <p className="text-sm text-neutral-600">
            No prompts found for "{searchQuery}"
          </p>
        </div>
        <div className="p-12 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-14 w-14 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-neutral-700 mb-2">We couldn't find any prompts matching your search</p>
          <p className="text-sm text-neutral-600">Try using different keywords or removing filters</p>
        </div>
      </div>
    );
  }

  // Results found - with improved scrolling
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col">
      <div className="p-4 border-b border-neutral-100">
        <h2 className="text-[17px] font-medium text-neutral-700">Results</h2>
        <p className="text-sm text-neutral-600">
          Found {searchResults.length} prompts for "{searchQuery}"
        </p>
      </div>
      
      <ul className="divide-y divide-neutral-100 overflow-y-auto hide-scrollbar" 
          style={{ maxHeight: searchResults.length > 5 ? '400px' : 'auto' }}>
        {searchResults.map(prompt => {
          const isFavorite = favorites.some(f => f.id === prompt.id);
          
          return (
            <li key={prompt.id} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-neutral-700 pr-2">{prompt.text}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => toggleFavorite(prompt)}
                    className={`p-1 rounded-full ${isFavorite ? 'text-secondary-500' : 'text-neutral-300'}`}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={16} className={isFavorite ? 'fill-secondary-500' : ''} />
                  </button>
                </div>
              </div>
              
              <div className="flex mt-3 justify-between items-center">
                <Badge variant={prompt.category}>
                  {prompt.category}
                </Badge>
                
                <button 
                  onClick={() => openPlayground(prompt)}
                  className="text-primary-500 text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
                >
                  <PlayCircle size={14} />
                  Try in Playground
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;