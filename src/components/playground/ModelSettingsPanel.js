// src/components/playground/ModelSettingsPanel.js
import React from 'react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

const ModelSettingsPanel = () => {
  const { modelSettings, handleModelSettingChange } = usePlaygroundState();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          AI Model
        </label>
        <select 
          value={modelSettings.model} 
          onChange={(e) => handleModelSettingChange('model', e.target.value)}
          className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-opus">Claude 3 Opus</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="mistral-large">Mistral Large</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Temperature: {modelSettings.temperature}
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={modelSettings.temperature}
          onChange={(e) => handleModelSettingChange('temperature', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Max Tokens: {modelSettings.maxTokens}
        </label>
        <input 
          type="range" 
          min="100" 
          max="4000" 
          step="100" 
          value={modelSettings.maxTokens}
          onChange={(e) => handleModelSettingChange('maxTokens', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Short</span>
          <span>Medium</span>
          <span>Long</span>
        </div>
      </div>
    </div>
  );
};

export default ModelSettingsPanel;