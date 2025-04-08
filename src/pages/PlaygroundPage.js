import React from 'react';
import { useAppContext } from '../context/AppContext';
import PlaygroundEditor from '../components/playground/PlaygroundEditor';
import PromptSettings from '../components/playground/PromptSettings';
import ResponseArea from '../components/playground/ResponseArea';
import QuickAccess from '../components/playground/QuickAccess';
import Card from '../components/common/Card';

const PlaygroundPage = () => {
  const { selectedPrompt, setSelectedPrompt, playgroundInput, setPlaygroundInput } = useAppContext();

  // Reset playgroundInput when selectedPrompt changes if it wasn't explicitly set
  React.useEffect(() => {
    if (selectedPrompt && !playgroundInput) {
      setPlaygroundInput(selectedPrompt.text);
    }
  }, [selectedPrompt, playgroundInput, setPlaygroundInput]);

  return (
    <div className="p-0 h-full bg-neutral-50 flex">
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg border border-neutral-200 overflow-hidden h-full">
        {/* Header - Removed gap between heading and content */}
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold">Playground</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Customize prompts and see how they perform with different AI models
          </p>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          {/* Unified Prompt Editor */}
          <PlaygroundEditor 
            selectedPrompt={selectedPrompt} 
            setSelectedPrompt={setSelectedPrompt} 
          />
          
          {/* Settings */}
          <PromptSettings />
          
          {/* Response Area */}
          <ResponseArea />
        </div>
      </div>
      
      {/* Quick Access - right side */}
      <div className="w-80 ml-4">
        <Card className="h-full">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-medium text-neutral-700">Quick Access</h2>
            <p className="text-sm text-neutral-500">Frequently used prompts</p>
          </div>
          
          <div className="p-3 h-[calc(100%-64px)] overflow-y-auto hide-scrollbar">
            <QuickAccess />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlaygroundPage;