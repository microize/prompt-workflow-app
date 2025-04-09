// src/components/promptLibrary/PromptDetailPanel.js
import React from 'react';
import { Star, Clock, Copy, Trash2, X } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useAppContext } from '../../context/AppContext';

const PromptDetailPanel = ({ prompt, onClose, onUsePrompt, onDelete }) => {
  const { favorites, toggleFavorite } = useAppContext();
  const isFavorite = favorites.some(f => f.id === prompt.id);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never used';
    
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
    <div className="hidden md:block w-80 ml-4 border border-neutral-200 bg-white rounded-lg shadow-sm overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
        <h3 className="font-medium text-neutral-700">Prompt Details</h3>
        <button 
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 max-h-[calc(100vh-240px)] overflow-y-auto">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-500 mb-1">Prompt Text</h4>
          <p className="text-neutral-800 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            {prompt.text}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-1">Category</h4>
            <Badge variant={prompt.category} className="w-full flex justify-center py-1">
              {prompt.category}
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-1">Usage Count</h4>
            <div className="flex items-center justify-center gap-1 bg-neutral-50 rounded-lg border border-neutral-200 p-2">
              <Star size={14} className="text-secondary-500" />
              <span>{prompt.usageCount || 0}</span>
            </div>
          </div>
        </div>
        
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-500 mb-1">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {prompt.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-500 mb-1">Last Used</h4>
          <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
            <Clock size={14} className="text-neutral-500" />
            <span className="text-sm">{prompt.usedAt ? formatDate(prompt.usedAt) : 'Never used'}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={onUsePrompt}
              className="w-full"
            >
              Use in Playground
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(prompt.text)}
                startIcon={<Copy size={14} />}
              >
                Copy
              </Button>
              
              <Button
                variant="outline"
                onClick={onDelete}
                startIcon={<Trash2 size={14} />}
                className="text-red-600 hover:bg-red-50 hover:border-red-200"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPanel;