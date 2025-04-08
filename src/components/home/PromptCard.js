import React from 'react';
import { PlayCircle, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const PromptCard = ({ prompt, type }) => {
  const { openPlayground, toggleFavorite, favorites } = useAppContext();
  
  const isFavorite = favorites.some(f => f.id === prompt.id);

  // Determine which metadata to show based on the card type
  const renderMetadata = () => {
    switch (type) {
      case 'recent':
        return <span className="text-xs text-neutral-500 ml-2">{prompt.usedAt}</span>;
      case 'popular':
        return (
          <div className="flex items-center text-secondary-500">
            <Star size={14} strokeWidth={1.75} className="mr-1 fill-secondary-500" />
            <span className="text-xs font-medium">{prompt.usageCount}</span>
          </div>
        );
      case 'favorite':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(prompt);
            }}
            className="text-secondary-500"
          >
            <Star size={16} strokeWidth={1.75} className="fill-secondary-500" />
          </button>
        );
      default:
        return null;
    }
  };

  // Get category style
  const getCategoryStyle = () => {
    switch (prompt.category) {
      case 'web':
        return 'bg-primary-50/70 text-primary-600 border border-primary-100';
      case 'design':
        return 'bg-purple-50/70 text-purple-600 border border-purple-100';
      case 'writing':
        return 'bg-success-50/70 text-success-500 border border-success-100';
      case 'marketing':
        return 'bg-secondary-50/70 text-secondary-600 border border-secondary-100';
      default:
        return 'bg-neutral-100/70 text-neutral-600 border border-neutral-200';
    }
  };

  // Additional metadata for favorites
  const renderFavoriteExtras = () => {
    if (type === 'favorite') {
      return (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-neutral-500">{prompt.addedAt}</span>
          <button 
            onClick={() => openPlayground(prompt)}
            className="text-primary-600 text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <PlayCircle size={14} strokeWidth={1.75} />
            Try
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 hover:bg-neutral-50 transition-all duration-200 cursor-pointer rounded-md">
      <div className="flex justify-between pr-1">
        <p className="text-neutral-700 line-clamp-2 pr-2 text-sm">{prompt.text}</p>
        {renderMetadata()}
      </div>
      <div className="flex mt-3 justify-between">
        <span className={`px-3 py-1 rounded-full text-xs ${getCategoryStyle()}`}>
          {prompt.category}
        </span>
        {type !== 'favorite' ? (
          <button 
            onClick={() => openPlayground(prompt)}
            className="text-primary-600 text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <PlayCircle size={14} strokeWidth={1.75} />
            Try in Playground
          </button>
        ) : renderFavoriteExtras()}
      </div>
    </div>
  );
};

export default PromptCard;