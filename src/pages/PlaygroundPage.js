import React from 'react';
import { useAppContext } from '../context/AppContext';
import PlaygroundEditor from '../components/playground/PlaygroundEditor';
import PromptSettings from '../components/playground/PromptSettings';
import ResponseArea from '../components/playground/ResponseArea';
import QuickAccess from '../components/playground/QuickAccess';

const PlaygroundPage = () => {
  const { selectedPrompt, setSelectedPrompt } = useAppContext();

  return (
    <div className="p-6">
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Test and Refine Prompts</h2>
          <p className="text-sm text-gray-500">
            Customize prompts and see how they perform with different AI models
          </p>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          {/* Selected Prompt */}
          <PlaygroundEditor 
            selectedPrompt={selectedPrompt} 
            setSelectedPrompt={setSelectedPrompt} 
          />
          
          {/* Settings */}
          <PromptSettings />
          
          {/* Response Area */}
          <ResponseArea />
          
          {/* Quick Access */}
          <QuickAccess />
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;