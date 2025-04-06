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
        return <span className="text-xs text-gray-500 ml-2">{prompt.usedAt}</span>;
      case 'popular':
        return (
          <div className="flex items-center text-amber-500">
            <Star size={14} className="mr-1 fill-amber-500" />
            <span className="text-xs">{prompt.usageCount}</span>
          </div>
        );
      case 'favorite':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(prompt);
            }}
            className="text-red-500"
          >
            <Star size={16} className="fill-amber-500" />
          </button>
        );
      default:
        return null;
    }
  };

  // Additional metadata for favorites
  const renderFavoriteExtras = () => {
    if (type === 'favorite') {
      return (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500">{prompt.addedAt}</span>
          <button 
            onClick={() => openPlayground(prompt)}
            className="text-blue-500 text-xs flex items-center gap-1 px-2 py-1 rounded bg-blue-50"
          >
            <PlayCircle size={14} />
            Try
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-3 hover:bg-gray-50">
      <div className="flex justify-between">
        <p className="text-gray-800 line-clamp-1">{prompt.text}</p>
        {renderMetadata()}
      </div>
      <div className="flex mt-2 justify-between">
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
          {prompt.category}
        </span>
        {type !== 'favorite' ? (
          <button 
            onClick={() => openPlayground(prompt)}
            className="text-blue-500 text-xs flex items-center gap-1 px-2 py-1 rounded bg-blue-50"
          >
            <PlayCircle size={14} />
            Try in Playground
          </button>
        ) : renderFavoriteExtras()}
      </div>
    </div>
  );
};

export default PromptCard;