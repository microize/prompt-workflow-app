import React from 'react';
import { PlayCircle, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * A reusable component for displaying a list of prompts
 * 
 * @param {Object} props
 * @param {Array} props.prompts - Array of prompt objects to display
 * @param {string} props.emptyMessage - Message to show when no prompts are available
 * @param {boolean} props.showCategory - Whether to show category badges
 * @param {boolean} props.showFavoriteButton - Whether to show the favorite toggle button
 * @param {boolean} props.showUsageCount - Whether to show the usage count
 * @param {boolean} props.showPlaygroundButton - Whether to show the "Try in Playground" button
 */
const PromptList = ({ 
  prompts = [], 
  emptyMessage = "No prompts available", 
  showCategory = true,
  showFavoriteButton = true,
  showUsageCount = false,
  showPlaygroundButton = true
}) => {
  const { openPlayground, toggleFavorite, favorites } = useAppContext();

  if (prompts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {prompts.map(prompt => {
        const isFavorite = favorites.some(f => f.id === prompt.id);
        
        return (
          <li key={prompt.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between">
              <p className="text-gray-800">{prompt.text}</p>
              <div className="flex items-center gap-2">
                {showUsageCount && prompt.usageCount && (
                  <div className="flex items-center text-amber-500">
                    <Star size={14} className="mr-1 fill-amber-500" />
                    <span className="text-xs">{prompt.usageCount}</span>
                  </div>
                )}
                
                {showFavoriteButton && (
                  <button 
                    onClick={() => toggleFavorite(prompt)}
                    className={`p-1 rounded-full ${isFavorite ? 'text-amber-500' : 'text-gray-400'}`}
                  >
                    <Star size={16} className={isFavorite ? 'fill-amber-500' : ''} />
                  </button>
                )}
                
                {showPlaygroundButton && (
                  <button 
                    onClick={() => openPlayground(prompt)}
                    className="text-blue-500 text-xs flex items-center gap-1 px-2 py-1 rounded bg-blue-50"
                  >
                    <PlayCircle size={14} />
                    Try in Playground
                  </button>
                )}
                
                {showCategory && prompt.category && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {prompt.category}
                  </span>
                )}
              </div>
            </div>
            
            {/* Optional timestamp or metadata row */}
            {prompt.usedAt && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">Used: {prompt.usedAt}</span>
              </div>
            )}
            {prompt.addedAt && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">Added: {prompt.addedAt}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default PromptList;