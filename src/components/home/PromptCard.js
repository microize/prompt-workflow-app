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
        return <span className="text-xs text-[#5f6368] ml-2">{prompt.usedAt}</span>;
      case 'popular':
        return (
          <div className="flex items-center text-[#fbbc04]">
            <Star size={14} className="mr-1" />
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
            className="text-[#fbbc04]"
          >
            <Star size={16} />
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

  // Additional metadata for favorites
  const renderFavoriteExtras = () => {
    if (type === 'favorite') {
      return (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-[#5f6368]">{prompt.addedAt}</span>
          <button 
            onClick={() => openPlayground(prompt)}
            className="text-[#4285f4] text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8f0fe]"
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
    <div className="p-4 hover:bg-[#f8f9fa] transition-colors">
      <div className="flex justify-between">
        <p className="text-[#3c4043] line-clamp-1">{prompt.text}</p>
        {renderMetadata()}
      </div>
      <div className="flex mt-3 justify-between">
        <span className={`px-3 py-1 rounded-full text-xs ${getCategoryStyle()}`}>
          {prompt.category}
        </span>
        {type !== 'favorite' ? (
          <button 
            onClick={() => openPlayground(prompt)}
            className="text-[#4285f4] text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8f0fe]"
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