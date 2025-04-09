// src/components/playground/ResponseArea.js
import React from 'react';
import { Copy } from 'lucide-react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

const ResponseArea = () => {
  const { response, isGenerating } = usePlaygroundState();

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      // Could add a toast notification here
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-neutral-50 border-b border-neutral-200">
        <span className="font-medium text-neutral-700">Response</span>
        <div className="flex gap-2">
          <button 
            onClick={handleCopyResponse}
            disabled={!response}
            className={`p-2 rounded-md transition-colors ${
              response 
                ? 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100' 
                : 'text-neutral-300 cursor-not-allowed'
            }`}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
      <div className="p-4 min-h-[200px] bg-neutral-50">
        {isGenerating ? (
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        ) : response ? (
          <div className="prose max-w-none">
            {response}
          </div>
        ) : (
          <p className="text-neutral-500 italic">Response will appear here after generating...</p>
        )}
      </div>
    </div>
  );
};

export default ResponseArea;

