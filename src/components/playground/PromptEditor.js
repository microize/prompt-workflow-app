// src/components/playground/PromptEditor.js
import React from 'react';
import { Star, Copy, Save, Paperclip, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';
import Badge from '../common/Badge';

const PromptEditor = () => {
  const { selectedPrompt, setSelectedPrompt, favorites, toggleFavorite } = useAppContext();
  const { 
    playgroundInput, 
    setPlaygroundInput, 
    attachedFiles, 
    handleRemoveFile 
  } = usePlaygroundState();
  
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
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-700">Prompt</span>
          {selectedPrompt && (
            <span className="text-sm text-neutral-500">{selectedPrompt.title || "Untitled"}</span>
          )}
        </div>
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
        placeholder="Type or paste your prompt here... Use {{variable_name}} for variables"
        className="w-full p-4 min-h-[200px] border-none focus:outline-none focus:ring-0 resize-none text-neutral-800"
      />
      
      {/* Attached Files Display */}
      {attachedFiles.length > 0 && (
        <div className="p-3 bg-neutral-50 border-t border-neutral-200">
          <div className="text-sm text-neutral-600 mb-2">Attached Files:</div>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map(file => (
              <AttachedFileTag 
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for attached file tags
const AttachedFileTag = ({ file, onRemove }) => (
  <div 
    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
      file.usedAsVariable 
        ? 'bg-primary-100 text-primary-700 border border-primary-200' 
        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
    }`}
  >
    <Paperclip size={14} className={file.usedAsVariable ? "text-primary-500" : "text-neutral-500"} />
    <span>{file.name}</span>
    <button 
      onClick={() => onRemove(file.id)}
      className="text-neutral-400 hover:text-neutral-700"
    >
      <X size={14} />
    </button>
  </div>
);

export default PromptEditor;

