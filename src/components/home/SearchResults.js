import React from 'react';
import { PlayCircle, Star, Loader } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const SearchResults = ({ searchQuery }) => {
  const { searchResults, isLoading, openPlayground, toggleFavorite, favorites } = useAppContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-[17px] font-medium text-[#3c4043]">Results</h2>
          <p className="text-sm text-[#5f6368]">Searching for "{searchQuery}"...</p>
        </div>
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader className="h-8 w-8 text-[#4285f4] animate-spin mb-4" />
          <p className="text-[#5f6368]">Searching prompts...</p>
        </div>
      </div>
    );
  }

  // Empty state - no search results
  if (searchResults.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-[17px] font-medium text-[#3c4043]">Results</h2>
          <p className="text-sm text-[#5f6368]">
            No prompts found for "{searchQuery}"
          </p>
        </div>
        <div className="p-12 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-14 w-14 text-[#dadce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[#3c4043] mb-2">We couldn't find any prompts matching your search</p>
          <p className="text-sm text-[#5f6368]">Try using different keywords or removing filters</p>
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-[17px] font-medium text-[#3c4043]">Results</h2>
        <p className="text-sm text-[#5f6368]">
          Found {searchResults.length} prompts for "{searchQuery}"
        </p>
      </div>
      
      <ul className="divide-y divide-gray-100">
        {searchResults.map(prompt => {
          const isFavorite = favorites.some(f => f.id === prompt.id);
          
          // Get category style
          const getCategoryStyle = () => {
            switch (prompt.category) {
              case 'web':
                return 'bg-[#e8f0fe] text-[#1a73e8]';
              case 'design':
                return 'bg-[#fce8ff] text-[#a142f4]';
              case 'writing':
                return 'bg-[#e6f4ea] text-[#137333]';
              case 'marketing':
                return 'bg-[#fef7e0] text-[#ea8600]';
              default:
                return 'bg-[#f1f3f4] text-[#5f6368]';
            }
          };
          
          return (
            <li key={prompt.id} className="p-4 hover:bg-[#f8f9fa] transition-colors">
              <div className="flex justify-between">
                <p className="text-[#3c4043]">{prompt.text}</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleFavorite(prompt)}
                    className={`p-1 rounded-full ${isFavorite ? 'text-[#fbbc04]' : 'text-[#dadce0]'}`}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={16} />
                  </button>
                  <button 
                    onClick={() => openPlayground(prompt)}
                    className="text-[#4285f4] text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8f0fe]"
                  >
                    <PlayCircle size={14} />
                    Try in Playground
                  </button>
                  <span className={`px-3 py-1 rounded-full text-xs ${getCategoryStyle()}`}>
                    {prompt.category}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;