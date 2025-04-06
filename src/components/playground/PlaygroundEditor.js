import React from 'react';
import { X, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const PlaygroundEditor = ({ selectedPrompt, setSelectedPrompt }) => {
  const { playgroundInput, setPlaygroundInput, toggleFavorite, favorites } = useAppContext();
  
  const isFavorite = selectedPrompt ? favorites.some(f => f.id === selectedPrompt.id) : false;

  return (
    <div className="flex flex-col gap-6">
      {/* Selected Prompt */}
      {selectedPrompt ? (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between">
            <h3 className="font-medium text-blue-800 mb-2">Selected Prompt</h3>
            <button 
              onClick={() => setSelectedPrompt(null)}
              className="text-gray-500"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-800">{selectedPrompt.text}</p>
          <div className="flex mt-3 justify-between">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {selectedPrompt.category}
            </span>
            <button 
              onClick={() => toggleFavorite(selectedPrompt)}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                isFavorite ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <Star size={14} className={isFavorite ? 'fill-amber-500' : ''} />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">No prompt selected yet</p>
          <p className="text-sm text-gray-400">
            Click "Try in Playground" on any prompt from the home page to load it here
          </p>
        </div>
      )}
      
      {/* Editor */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-700">Edit Prompt</h3>
          <button 
            onClick={() => setPlaygroundInput('')}
            className="text-xs text-gray-500"
          >
            Clear
          </button>
        </div>
        <textarea
          value={playgroundInput || (selectedPrompt ? selectedPrompt.text : '')}
          onChange={(e) => setPlaygroundInput(e.target.value)}
          placeholder="Type or paste your prompt here..."
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-40"
        />
      </div>
    </div>
  );
};

export default PlaygroundEditor;