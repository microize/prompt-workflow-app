// src/pages/PlaygroundPage.js
import React from 'react';
import { 
  PlayCircle, 
  Paperclip, 
  Settings, 
  Sliders as SlidersIcon 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PromptEditor from '../components/playground/PromptEditor';
import ModelSettingsPanel from '../components/playground/ModelSettingsPanel';
import VariablesPanel from '../components/playground/VariablesPanel';
import FilesPanel from '../components/playground/FilesPanel';
import AdvancedSettingsPanel from '../components/playground/AdvancedSettingsPanel';
import ResponseArea from '../components/playground/ResponseArea';
import QuickAccessPanel from '../components/playground/QuickAccessPanel';
import RecentExecutionsPanel from '../components/playground/RecentExecutionsPanel';
import { usePlaygroundState } from '../hooks/usePlaygroundState';

const PlaygroundPage = () => {
  const { selectedPrompt } = useAppContext();
  const { 
    activeSettingsTab,
    setActiveSettingsTab,
    executePrompt,
    modelSettings
  } = usePlaygroundState();

  return (
    <div className="p-0 h-full bg-neutral-50 flex">
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg border border-neutral-200 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex-shrink-0">
          <h2 className="text-xl font-semibold">Playground</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Customize prompts and see how they perform with different AI models
          </p>
        </div>
        
        {/* Main content area - Made scrollable */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-grow">
          {/* Prompt Editor */}
          <PromptEditor />
          
          {/* Model Settings */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="flex flex-wrap lg:flex-nowrap">
              {/* Settings Tabs */}
              <div className="w-full lg:w-64 border-r border-neutral-200">
                <div className="p-3 font-medium text-neutral-700 bg-neutral-50 border-b border-neutral-200">
                  Settings
                </div>
                <div className="p-1">
                  <SettingsTabButton 
                    title="General"
                    icon="sliders"
                    isActive={activeSettingsTab === 'general'}
                    onClick={() => setActiveSettingsTab('general')}
                  />
                  
                  <SettingsTabButton 
                    title="Variables"
                    icon="braces"
                    isActive={activeSettingsTab === 'variables'}
                    onClick={() => setActiveSettingsTab('variables')}
                  />
                  
                  <SettingsTabButton 
                    title="Files"
                    icon="paperclip"
                    isActive={activeSettingsTab === 'files'}
                    onClick={() => setActiveSettingsTab('files')}
                  />
                  
                  <SettingsTabButton 
                    title="Advanced"
                    icon="settings"
                    isActive={activeSettingsTab === 'advanced'}
                    onClick={() => setActiveSettingsTab('advanced')}
                  />
                </div>
              </div>
              
              {/* Settings Content */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                {activeSettingsTab === 'general' && <ModelSettingsPanel />}
                {activeSettingsTab === 'variables' && <VariablesPanel />}
                {activeSettingsTab === 'files' && <FilesPanel />}
                {activeSettingsTab === 'advanced' && <AdvancedSettingsPanel />}
              </div>
            </div>
          </div>
          
          {/* Response Area */}
          <ResponseArea />
          
          {/* Run Button */}
          <div className="flex justify-center">
            <button 
              onClick={executePrompt}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <PlayCircleIcon size={20} />
              Run Prompt
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Access Panel */}
      <QuickAccessPanel />
    </div>
  );
};

// Helper component for settings tabs
const SettingsTabButton = ({ title, icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 w-full p-3 text-left rounded-md ${
        isActive 
          ? 'bg-primary-50 text-primary-600' 
          : 'text-neutral-600 hover:bg-neutral-100'
      }`}
    >
      <IconComponent name={icon} size={16} />
      <span>{title}</span>
    </button>
  );
};

// Simple icon component that maps string names to Lucide components
const IconComponent = ({ name, size = 16, className = "" }) => {
  const icons = {
    sliders: <SlidersIcon size={size} className={className} />,
    braces: <span className="font-mono text-sm">{ }</span>,
    paperclip: <Paperclip size={size} className={className} />,
    settings: <Settings size={size} className={className} />,
    play: <PlayCircle size={size} className={className} />
  };
  
  return icons[name] || null;
};

// For export
const PlayCircleIcon = ({ size }) => <PlayCircle size={size} />;

export default PlaygroundPage;