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
    <div className="p-8 h-full flex animate-fade-in bg-neutral-50">
      {/* Main content area - left side */}
      <div className="flex-1 pr-4">
        <Card className="overflow-hidden h-full">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="text-xl font-semibold text-neutral-800">Test and Refine Prompts</h2>
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
        </Card>
      </div>
      
      {/* Quick Access - right side */}
      <div className="w-80">
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