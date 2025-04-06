import React from 'react';
import { Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const QuickAccess = () => {
  const { popularPrompts, setSelectedPrompt, setPlaygroundInput } = useAppContext();

  return (
    <div className="border-t pt-4 mt-2">
      <h3 className="font-medium text-gray-700 mb-3">Quick Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {popularPrompts.map(prompt => (
          <button 
            key={prompt.id}
            onClick={() => {
              setSelectedPrompt(prompt);
              setPlaygroundInput(prompt.text);
            }}
            className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <p className="text-gray-800 text-sm line-clamp-2">{prompt.text}</p>
            <div className="flex mt-2 justify-between items-center">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {prompt.category}
              </span>
              <div className="flex items-center text-amber-500">
                <Star size={12} className="mr-1 fill-amber-500" />
                <span className="text-xs">{prompt.usageCount}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;