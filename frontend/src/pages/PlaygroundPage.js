import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Paperclip, 
  Settings, 
  Plus,
  ChevronDown,
  ChevronUp,
  Clipboard,
  ArrowRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { usePlaygroundState } from '../hooks/usePlaygroundState';

// Import components from their correct locations
import ResponseArea from '../components/playground/ResponseArea';
import SettingsPanel from '../components/playground/SettingsPanel';
import QuickAccessPanel from '../components/playground/QuickAccessPanel';

// Main Playground Component
const PlaygroundPage = () => {
  const { 
    selectedPrompt, 
    favorites, 
    recentlyUsedPrompts, 
    popularPrompts, 
    setSelectedPrompt,
    openPlayground
  } = useAppContext();
  
  const { 
    playgroundInput, 
    setPlaygroundInput,
    response,
    isGenerating,
    executePrompt,
    modelSettings,
    handleModelSettingChange,
    variables,
    setVariables,
    attachedFiles,
    handleFileAttachment,
    handleRemoveFile
  } = usePlaygroundState();
  
  const [expandedSections, setExpandedSections] = useState({
    prompt: true,
    settings: false,
    response: true
  });
  
  const [showQuickAccess, setShowQuickAccess] = useState(window.innerWidth >= 1280);
  const [responseSizeClass, setResponseSizeClass] = useState('min-h-[200px]');
  
  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setShowQuickAccess(window.innerWidth >= 1280);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Adjust response height when toggling sections
    if (section === 'prompt' || section === 'settings') {
      setResponseSizeClass(prev => 
        prev === 'min-h-[200px]' ? 'min-h-[400px]' : 'min-h-[200px]'
      );
    }
  };
  
  // Use a prompt from quick access
  const handleUsePrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setPlaygroundInput(prompt.text);
    
    // If there are model-specific settings, apply them
    if (prompt.settings) {
      Object.entries(prompt.settings).forEach(([key, value]) => {
        handleModelSettingChange(key, value);
      });
    }
  };
  
  // Get the current date for the response metadata
  const generatedAt = isGenerating || !response ? null : new Date();

  return (
    <div className="flex h-full bg-neutral-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-neutral-100 bg-white">
          <h2 className="text-xl font-semibold">Playground</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Customize prompts and see how they perform with different AI models
          </p>
        </div>
        
        <div className="p-6 flex flex-col gap-6 flex-grow">
          {/* Prompt Section */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <div 
              className="flex justify-between items-center p-3 bg-neutral-50 border-b border-neutral-200 cursor-pointer"
              onClick={() => toggleSection('prompt')}
            >
              <h3 className="font-medium text-neutral-700 flex items-center">
                Prompt Editor
                {attachedFiles && attachedFiles.length > 0 && (
                  <span className="ml-2 text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                    {attachedFiles.length} file{attachedFiles.length > 1 ? 's' : ''}
                  </span>
                )}
                {variables && variables.length > 0 && (
                  <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                    {variables.length} variable{variables.length > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <button className="text-neutral-400">
                {expandedSections.prompt ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            
            {expandedSections.prompt && (
              <div className="p-4">
                <textarea
                  value={playgroundInput || ''}
                  onChange={(e) => setPlaygroundInput(e.target.value)}
                  placeholder="Type or paste your prompt here... Use {{variable_name}} for variables."
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none h-32 font-mono text-sm"
                />
                
                {/* Actions Row */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleFileAttachment}
                      className="flex items-center gap-1.5 text-sm text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors px-3 py-1.5 rounded-md"
                    >
                      <Paperclip size={16} />
                      <span>Files</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors px-3 py-1.5 rounded-md">
                      <Plus size={16} />
                      <span>Variables</span>
                    </button>
                    <button 
                      onClick={() => toggleSection('settings')}
                      className="flex items-center gap-1.5 text-sm text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors px-3 py-1.5 rounded-md"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="mr-3 text-sm text-neutral-500 hover:text-neutral-700"
                      onClick={() => setPlaygroundInput('')}
                    >
                      Clear
                    </button>
                    <button
                      disabled={isGenerating || !playgroundInput?.trim()}
                      onClick={executePrompt}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isGenerating || !playgroundInput?.trim()
                          ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle size={18} />
                          <span>Run</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Panel (Collapsible) */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <div 
              className="flex justify-between items-center p-3 bg-neutral-50 border-b border-neutral-200 cursor-pointer"
              onClick={() => toggleSection('settings')}
            >
              <h3 className="font-medium text-neutral-700">Model Settings</h3>
              <div className="flex items-center">
                <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full mr-2">
                  {modelSettings.model}
                </span>
                <button className="text-neutral-400">
                  {expandedSections.settings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
            
            {expandedSections.settings && (
              <div className="p-4">
                <SettingsPanel 
                  modelSettings={modelSettings}
                  handleModelSettingChange={handleModelSettingChange}
                  variables={variables}
                  setVariables={setVariables}
                  files={attachedFiles}
                  setFiles={(files) => {
                    // Implementation would handle file updates
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Response Area */}
          <ResponseArea 
            response={response} 
            isGenerating={isGenerating}
            model={modelSettings.model}
            generatedAt={generatedAt}
          />
          
          {/* Stats/Info Panel */}
          {response && !isGenerating && (
            <div className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-neutral-600">
                  <Clipboard size={14} />
                  <span>Prompt: ~{Math.ceil((playgroundInput?.length || 0) / 4)} tokens</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-600">
                  <ArrowRight size={14} />
                  <span>Response: ~{Math.ceil(response.length / 4)} tokens</span>
                </div>
              </div>
              <div className="text-neutral-500">
                Generated in {Math.random().toFixed(2)}s
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Access Panel (only on larger screens) */}
      {showQuickAccess && (
        <QuickAccessPanel 
          favorites={favorites}
          recentPrompts={recentlyUsedPrompts}
          popularPrompts={popularPrompts}
          onUsePrompt={handleUsePrompt}
        />
      )}
    </div>
  );
};

export default PlaygroundPage;