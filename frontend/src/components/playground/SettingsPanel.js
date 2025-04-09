import React, { useState } from 'react';
import { 
  Sliders, 
  FileText, 
  Code, 
  Settings,
  Info,
  X
} from 'lucide-react';

const SettingsPanel = ({ modelSettings, handleModelSettingChange, variables, setVariables, files, setFiles }) => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
      <div className="border-b border-neutral-200">
        <nav className="flex">
          <TabButton 
            icon={<Sliders size={16} />}
            label="General"
            isActive={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          />
          <TabButton 
            icon={<Code size={16} />}
            label="Variables"
            isActive={activeTab === 'variables'}
            onClick={() => setActiveTab('variables')}
            badge={variables?.length > 0 ? variables.length : null}
          />
          <TabButton 
            icon={<FileText size={16} />}
            label="Files"
            isActive={activeTab === 'files'}
            onClick={() => setActiveTab('files')}
            badge={files?.length > 0 ? files.length : null}
          />
          <TabButton 
            icon={<Settings size={16} />}
            label="Advanced"
            isActive={activeTab === 'advanced'}
            onClick={() => setActiveTab('advanced')}
          />
        </nav>
      </div>
      
      <div className="p-5">
        {activeTab === 'general' && (
          <GeneralSettings 
            modelSettings={modelSettings}
            handleModelSettingChange={handleModelSettingChange}
          />
        )}
        
        {activeTab === 'variables' && (
          <VariablesSettings 
            variables={variables || []}
            setVariables={setVariables}
          />
        )}
        
        {activeTab === 'files' && (
          <FilesSettings 
            files={files || []}
            setFiles={setFiles}
          />
        )}
        
        {activeTab === 'advanced' && (
          <AdvancedSettings 
            modelSettings={modelSettings}
            handleModelSettingChange={handleModelSettingChange}
          />
        )}
      </div>
    </div>
  );
};

// Tab button component
const TabButton = ({ icon, label, isActive, onClick, badge = null }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors relative ${
      isActive 
        ? 'border-primary-500 text-primary-600 font-medium' 
        : 'border-transparent text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
    }`}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
        isActive 
          ? 'bg-primary-100 text-primary-700' 
          : 'bg-neutral-100 text-neutral-700'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

// General settings tab content
const GeneralSettings = ({ modelSettings, handleModelSettingChange }) => (
  <div className="space-y-5">
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
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-neutral-700">
          Temperature
        </label>
        <span className="text-sm text-neutral-600 bg-neutral-100 px-2 rounded">
          {modelSettings.temperature}
        </span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1" 
        value={modelSettings.temperature}
        onChange={(e) => handleModelSettingChange('temperature', parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-neutral-500 mt-1">
        <span>Precise</span>
        <span>Balanced</span>
        <span>Creative</span>
      </div>
    </div>
    
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-neutral-700">
          Max Tokens
        </label>
        <span className="text-sm text-neutral-600 bg-neutral-100 px-2 rounded">
          {modelSettings.maxTokens}
        </span>
      </div>
      <input 
        type="range" 
        min="100" 
        max="4000" 
        step="100" 
        value={modelSettings.maxTokens}
        onChange={(e) => handleModelSettingChange('maxTokens', parseInt(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-neutral-500 mt-1">
        <span>Short</span>
        <span>Medium</span>
        <span>Long</span>
      </div>
    </div>
    
    <div className="p-3 bg-primary-50 border border-primary-100 rounded-lg text-neutral-700 text-sm flex items-start gap-2">
      <Info size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-primary-800">Model notes</p>
        <p className="text-primary-700">Higher temperature values produce more creative and varied responses, while lower values generate more focused and deterministic outputs.</p>
      </div>
    </div>
  </div>
);

// Variables settings tab content (simplified)
const VariablesSettings = ({ variables, setVariables }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-medium text-neutral-700">Prompt Variables</h3>
      <button className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600">
        Add Variable
      </button>
    </div>
    
    <p className="text-sm text-neutral-500">
      Add variables to your prompt using the format: &#123;&#123;variable_name&#125;&#125;
    </p>
    
    {variables.length > 0 ? (
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-2 text-left font-medium text-neutral-600">Name</th>
              <th className="px-4 py-2 text-left font-medium text-neutral-600">Value</th>
              <th className="px-4 py-2 text-right font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variables.map(variable => (
              <tr key={variable.id} className="border-b border-neutral-200">
                <td className="px-4 py-3 font-mono">{variable.name}</td>
                <td className="px-4 py-3">{variable.value}</td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 text-neutral-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="p-6 text-center border border-dashed border-neutral-300 rounded-lg">
        <p className="text-neutral-500">No variables added yet</p>
      </div>
    )}
  </div>
);

// Files settings tab content (simplified)
const FilesSettings = ({ files, setFiles }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-medium text-neutral-700">Attached Files</h3>
      <button className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600">
        Attach File
      </button>
    </div>
    
    <p className="text-sm text-neutral-500">
      Files will be available to the model during processing.
    </p>
    
    {files && files.length > 0 ? (
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="p-3 bg-neutral-50 border-b border-neutral-200">
          {files.length} File{files.length !== 1 ? 's' : ''} Attached
        </div>
        <ul className="divide-y divide-neutral-200">
          {files.map(file => (
            <li key={file.id} className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <FileText size={16} className="text-neutral-400 mr-2" />
                <div>
                  <div className="text-neutral-800">{file.name}</div>
                  <div className="text-xs text-neutral-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <button className="p-1 text-neutral-400 hover:text-red-500">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="p-6 text-center border border-dashed border-neutral-300 rounded-lg">
        <p className="text-neutral-500">No files attached</p>
      </div>
    )}
  </div>
);

// Advanced settings tab content
const AdvancedSettings = ({ modelSettings, handleModelSettingChange }) => (
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
      />
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
  </div>
);

export default SettingsPanel;