// src/components/promptLibrary/PromptList.js
import React from 'react';
import { Star, PlayCircle } from 'lucide-react';
import Badge from '../common/Badge';
import { useAppContext } from '../../context/AppContext';

const PromptList = ({ prompts, selectedPromptId, onSelectPrompt, onDelete }) => {
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
    <div className="overflow-hidden rounded-lg border border-neutral-200 flex-grow flex flex-col">
      <div className="overflow-y-auto w-full h-full">
        <table className="w-full">
          <thead className="sticky top-0 bg-neutral-50 z-10">
            <tr className="border-b border-neutral-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prompt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-20">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-48">Last Used</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {prompts.map(prompt => {
              const isFavorite = favorites.some(f => f.id === prompt.id);
              
              return (
                <tr 
                  key={prompt.id} 
                  className={`hover:bg-neutral-50 transition-colors cursor-pointer ${
                    selectedPromptId === prompt.id ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => onSelectPrompt(prompt)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt);
                        }}
                        className={`p-1 mr-2 rounded-full flex-shrink-0 ${isFavorite ? 'text-secondary-500' : 'text-neutral-300 hover:text-neutral-400'}`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      <div>
                        <p className="font-medium text-neutral-800 line-clamp-2">
                          {prompt.text}
                        </p>
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prompt.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {prompt.tags.length > 2 && (
                              <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                +{prompt.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={prompt.category} size="sm">
                      {prompt.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {prompt.usageCount || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {prompt.usedAt ? formatDate(prompt.usedAt) : 'Never used'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlayground(prompt);
                        }}
                        className="text-xs px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 prompt-try-button"
                        title="Use this prompt in the playground"
                      >
                        Use
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromptList;