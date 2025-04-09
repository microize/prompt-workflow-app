import React from 'react';
import { Send } from 'lucide-react';

const PromptSettings = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
            <option>GPT-4</option>
            <option>Claude</option>
            <option>Gemini</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
            <option>0.7 (Balanced)</option>
            <option>0.0 (Deterministic)</option>
            <option>1.0 (Creative)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
            <option>500 tokens</option>
            <option>1000 tokens</option>
            <option>2000 tokens</option>
          </select>
        </div>
      </div>
      
      {/* Generate Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Send size={18} />
          Generate Response
        </button>
      </div>
    </>
  );
};

export default PromptSettings;