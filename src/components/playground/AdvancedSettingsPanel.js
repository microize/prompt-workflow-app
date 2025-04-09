// src/components/playground/AdvancedSettingsPanel.js
import React from 'react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

const AdvancedSettingsPanel = () => {
  const { modelSettings, handleModelSettingChange } = usePlaygroundState();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Top P: {modelSettings.topP}
        </label>
        <input 
          type="range" 
          min="0.1" 
          max="1" 
          step="0.1" 
          value={modelSettings.topP}
          onChange={(e) => handleModelSettingChange('topP', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Frequency Penalty: {modelSettings.frequencyPenalty}
        </label>
        <input 
          type="range" 
          min="-2" 
          max="2" 
          step="0.1" 
          value={modelSettings.frequencyPenalty}
          onChange={(e) => handleModelSettingChange('frequencyPenalty', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Presence Penalty: {modelSettings.presencePenalty}
        </label>
        <input 
          type="range" 
          min="-2" 
          max="2" 
          step="0.1" 
          value={modelSettings.presencePenalty}
          onChange={(e) => handleModelSettingChange('presencePenalty', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          System Prompt
        </label>
        <textarea
          value={modelSettings.systemPrompt}
          onChange={(e) => handleModelSettingChange('systemPrompt', e.target.value)}
          placeholder="You are a helpful assistant..."
          className="w-full p-2 h-24 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        ></textarea>
        <p className="mt-1 text-xs text-neutral-500">
          Define the AI assistant's behavior and capabilities
        </p>
      </div>
      
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input 
            type="checkbox" 
            checked={modelSettings.streamResponse}
            onChange={(e) => handleModelSettingChange('streamResponse', e.target.checked)}
          />
          Stream response
        </label>
        <p className="ml-5 mt-1 text-xs text-neutral-500">
          Display the response as it's being generated
        </p>
      </div>
      
      <ModelSpecificSettings 
        modelSettings={modelSettings} 
        handleModelSettingChange={handleModelSettingChange} 
      />
    </div>
  );
};

const ModelSpecificSettings = ({ modelSettings, handleModelSettingChange }) => (
  <div className="border-t border-neutral-200 pt-4 mt-4">
    <h3 className="font-medium text-neutral-700 mb-3">Model-Specific Settings</h3>
    
    {modelSettings.model.includes('gpt') && (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Function Calling
          </label>
          <select 
            value={modelSettings.functionCalling}
            onChange={(e) => handleModelSettingChange('functionCalling', e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="auto">Auto</option>
            <option value="none">None</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input 
              type="checkbox" 
              checked={modelSettings.jsonMode}
              onChange={(e) => handleModelSettingChange('jsonMode', e.target.checked)}
            />
            JSON mode
          </label>
          <p className="ml-5 mt-1 text-xs text-neutral-500">
            Force the model to output valid JSON
          </p>
        </div>
      </div>
    )}
    
    {modelSettings.model.includes('claude') && (
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input 
              type="checkbox" 
              checked={modelSettings.extendedThinking}
              onChange={(e) => handleModelSettingChange('extendedThinking', e.target.checked)}
            />
            Enable extended thinking
          </label>
          <p className="ml-5 mt-1 text-xs text-neutral-500">
            Allow Claude to reason through complex problems step-by-step
          </p>
        </div>
      </div>
    )}
  </div>
);

export default AdvancedSettingsPanel;

