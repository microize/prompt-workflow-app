import React from 'react';
import { X, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Badge from '../common/Badge';
import Button from '../common/Button';

const PlaygroundEditor = ({ selectedPrompt, setSelectedPrompt }) => {
  const { playgroundInput, setPlaygroundInput, toggleFavorite, favorites } = useAppContext();
  
  const isFavorite = selectedPrompt ? favorites.some(f => f.id === selectedPrompt.id) : false;

  return (
    <div className="flex flex-col gap-6">
      {/* Selected Prompt */}
      {selectedPrompt ? (
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <div className="flex justify-between">
            <h3 className="font-medium text-primary-700 mb-2">Selected Prompt</h3>
            <button 
              onClick={() => setSelectedPrompt(null)}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-neutral-800">{selectedPrompt.text}</p>
          <div className="flex mt-3 justify-between">
            <Badge variant={selectedPrompt.category}>
              {selectedPrompt.category}
            </Badge>
            <Button
              variant="text"
              size="sm"
              startIcon={<Star size={14} className={isFavorite ? 'fill-secondary-500' : ''} />}
              onClick={() => toggleFavorite(selectedPrompt)}
              className={isFavorite ? 'text-secondary-500' : ''}
            >
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center">
          <p className="text-neutral-500 mb-4">No prompt selected yet</p>
          <p className="text-sm text-neutral-400">
            Click "Try in Playground" on any prompt from the home page to load it here
          </p>
        </div>
      )}
      
      {/* Editor */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-neutral-700">Edit Prompt</h3>
          <button 
            onClick={() => setPlaygroundInput('')}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          value={playgroundInput || (selectedPrompt ? selectedPrompt.text : '')}
          onChange={(e) => setPlaygroundInput(e.target.value)}
          placeholder="Type or paste your prompt here..."
          className="w-full p-4 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-40"
        />
      </div>
    </div>
  );
};

export default PlaygroundEditor;