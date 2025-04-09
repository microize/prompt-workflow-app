// src/components/promptLibrary/PromptGrid.js
import React from 'react';
import { Star, PlayCircle, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';

const PromptGrid = ({ prompts, selectedPromptId, onSelectPrompt, onDelete }) => {
  const { toggleFavorite, favorites, openPlayground } = useAppContext();
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    // For demo purposes - parse relative dates or actual dates
    if (dateString.includes('ago') || dateString.includes('day') || dateString.includes('week')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-grow">
      {prompts.map(prompt => {
        const isFavorite = favorites.some(f => f.id === prompt.id);
        
        return (
          <Card 
            key={prompt.id} 
            className={`flex flex-col hover:shadow-md transition-shadow ${
              selectedPromptId === prompt.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => onSelectPrompt(prompt)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-grow">
                <p className="font-medium text-neutral-800 line-clamp-2">{prompt.text}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(prompt);
                }}
                className={`p-1 rounded-full flex-shrink-0 ${isFavorite ? 'text-secondary-500' : 'text-neutral-300 hover:text-neutral-400'}`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="mt-2 mb-4 flex-grow">
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {prompt.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                      +{prompt.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-auto pt-3 border-t border-neutral-100">
              <Badge variant={prompt.category} size="sm">
                {prompt.category}
              </Badge>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs text-neutral-500">
                  <Clock size={12} className="mr-1" />
                  {prompt.usedAt ? formatDate(prompt.usedAt) : 'Never used'}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPlayground(prompt);
                  }}
                  className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 prompt-try-button"
                  title="Use this prompt in the playground"
                >
                  Use
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PromptGrid;