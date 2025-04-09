import React from 'react';
import { Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Badge from '../common/Badge';

const PlaygroundEditor = ({ selectedPrompt, setSelectedPrompt }) => {
  const { playgroundInput, setPlaygroundInput, toggleFavorite, favorites } = useAppContext();
  
  const isFavorite = selectedPrompt ? favorites.some(f => f.id === selectedPrompt.id) : false;

  // Handle text changes in the editor
  const handleTextChange = (e) => {
    setPlaygroundInput(e.target.value);
  };

  // Clear the text editor
  const handleClear = () => {
    setPlaygroundInput('');
    setSelectedPrompt(null);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-neutral-700">Prompt</h3>
        <div className="flex items-center gap-2">
          {selectedPrompt && (
            <Badge variant={selectedPrompt.category}>
              {selectedPrompt.category}
            </Badge>
          )}
          
          {selectedPrompt && (
            <button 
              onClick={() => toggleFavorite(selectedPrompt)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                isFavorite ? 'text-secondary-500' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Star size={16} className={isFavorite ? 'fill-secondary-500' : ''} />
              {isFavorite ? 'Favorited' : 'Favorite'}
            </button>
          )}
          
          <button 
            onClick={handleClear}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      
      <textarea
        value={playgroundInput || ''}
        onChange={handleTextChange}
        placeholder="Type or paste your prompt here..."
        className="w-full p-4 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-40"
      />
      
      {!selectedPrompt && !playgroundInput && (
        <p className="text-sm text-neutral-500 mt-2">
          Click "Try in Playground" on any prompt from the home page or create a new prompt here
        </p>
      )}
    </div>
  );
};

export default PlaygroundEditor;