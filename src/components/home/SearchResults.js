import React from 'react';
import { PlayCircle, Star, Loader } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const SearchResults = ({ searchQuery }) => {
  const { searchResults, isLoading, openPlayground, toggleFavorite, favorites } = useAppContext();

  // Empty state - no search results
  if (searchResults.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Results</h2>
          <p className="text-sm text-gray-500">
            No prompts found for "{searchQuery}"
          </p>
        </div>
        <div className="p-12 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">We couldn't find any prompts matching your search</p>
          <p className="text-sm text-gray-400">Try using different keywords or removing filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Results</h2>
        <p className="text-sm text-gray-500">
          {isLoading 
            ? "Searching..." 
            : `Found ${searchResults.length} prompts for "${searchQuery}"`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Searching prompts...</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {searchResults.map(prompt => {
            const isFavorite = favorites.some(f => f.id === prompt.id);
            
            return (
              <li key={prompt.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <p className="text-gray-800">{prompt.text}</p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleFavorite(prompt)}
                      className={`p-1 rounded-full ${isFavorite ? 'text-amber-500' : 'text-gray-400'} hover:bg-gray-100`}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={16} className={isFavorite ? 'fill-amber-500' : ''} />
                    </button>
                    <button 
                      onClick={() => openPlayground(prompt)}
                      className="text-blue-500 text-xs flex items-center gap-1 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <PlayCircle size={14} />
                      Try in Playground
                    </button>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {prompt.category}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;