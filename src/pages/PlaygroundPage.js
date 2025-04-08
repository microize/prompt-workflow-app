import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Settings, 
  Save, 
  Plus, 
  Paperclip, 
  Sliders, 
  PlayCircle, 
  Book, 
  Star, 
  X, 
  Clock, 
  Copy, 
  FileText, 
  Filter,
  BarChart,
  TrendingUp
} from 'lucide-react';

// Main PlaygroundPage Component
const PlaygroundPage = () => {
  const { selectedPrompt, setSelectedPrompt, playgroundInput, setPlaygroundInput } = useAppContext();
  
  // State for settings
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [variables, setVariables] = useState([
    { id: 1, name: 'username', value: 'John Doe', description: 'User\'s full name' },
    { id: 2, name: 'company', value: 'Acme Corp', description: 'Company name' }
  ]);
  const [newVariable, setNewVariable] = useState({ name: '', value: '', description: '' });
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  
  // Model settings
  const [modelSettings, setModelSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: 'You are a helpful assistant.',
    streamResponse: true,
    jsonMode: false,
    functionCalling: 'auto',
    extendedThinking: true
  });
  
  // Quick access state
  const [quickAccessTab, setQuickAccessTab] = useState('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample quick access prompts
  const [quickAccessPrompts, setQuickAccessPrompts] = useState([
    { 
      id: 1, 
      title: "Write a blog post", 
      text: "Write a well-structured blog post about {{topic}} with the following sections: introduction, {{section1}}, {{section2}}, {{section3}}, and conclusion.", 
      tags: ["writing", "blog"],
      favorite: true,
      lastUsed: "2025-04-06T14:30:00Z",
      usageCount: 23,
      settings: {
        model: 'gpt-4',
        temperature: 0.8,
        maxTokens: 2500
      }
    },
    { 
      id: 2, 
      title: "Generate product description", 
      text: "Create a compelling product description for {{product_name}} that highlights its key features, benefits, and target audience.", 
      tags: ["marketing", "product"],
      favorite: false,
      lastUsed: "2025-04-07T10:15:00Z",
      usageCount: 42,
      settings: {
        model: 'claude-3-opus',
        temperature: 0.6,
        maxTokens: 1500
      }
    },
    { 
      id: 3, 
      title: "Code refactoring", 
      text: "Refactor the following {{language}} code to improve readability, efficiency, and adhere to best practices:\n\n```{{language}}\n{{code}}\n```", 
      tags: ["development", "code"],
      favorite: true,
      lastUsed: "2025-04-05T16:45:00Z",
      usageCount: 16,
      settings: {
        model: 'gpt-4',
        temperature: 0.2,
        maxTokens: 3000
      }
    },
    { 
      id: 4, 
      title: "Email campaign", 
      text: "Write an email campaign for {{product}} targeting {{audience}}. Include a subject line, engaging introduction, key points, and a strong call to action.", 
      tags: ["marketing", "email"],
      favorite: false,
      lastUsed: "2025-04-04T09:20:00Z",
      usageCount: 35,
      settings: {
        model: 'claude-3-sonnet',
        temperature: 0.7,
        maxTokens: 1800
      }
    },
    { 
      id: 5, 
      title: "Data analysis report", 
      text: "Analyze the attached data file and provide insights on {{analysis_focus}}. Include trends, anomalies, and recommendations.", 
      tags: ["data", "analysis"],
      favorite: true,
      lastUsed: "2025-04-03T13:10:00Z",
      usageCount: 19,
      settings: {
        model: 'gpt-4',
        temperature: 0.4,
        maxTokens: 2500
      }
    }
  ]);
  
  // Recent executions
  const [recentExecutions, setRecentExecutions] = useState([
    { id: 1, prompt: "Write a product description for...", timestamp: "2h ago" },
    { id: 2, prompt: "Create a marketing email for...", timestamp: "Yesterday" },
    { id: 3, prompt: "Analyze customer feedback...", timestamp: "2 days ago" }
  ]);

  // Reset playgroundInput when selectedPrompt changes if it wasn't explicitly set
  useEffect(() => {
    if (selectedPrompt && !playgroundInput) {
      setPlaygroundInput(selectedPrompt.text);
    }
  }, [selectedPrompt, playgroundInput, setPlaygroundInput]);
  
  // Handle model setting changes
  const handleModelSettingChange = (setting, value) => {
    setModelSettings({
      ...modelSettings,
      [setting]: value
    });
  };

  // Add a new variable
  const handleAddVariable = () => {
    if (newVariable.name.trim() === '') return;
    
    setVariables([
      ...variables,
      {
        id: Date.now(),
        name: newVariable.name,
        value: newVariable.value,
        description: newVariable.description
      }
    ]);
    
    setNewVariable({ name: '', value: '', description: '' });
    setIsAddingVariable(false);
  };

  // Delete a variable
  const handleDeleteVariable = (id) => {
    setVariables(variables.filter(variable => variable.id !== id));
  };

  // Handle file attachment
  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      usedAsVariable: false,
      variableName: file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase()
    }));
    
    setAttachedFiles([...attachedFiles, ...newFiles]);
  };

  // Remove attached file
  const handleRemoveFile = (id) => {
    setAttachedFiles(attachedFiles.filter(file => file.id !== id));
  };
  
  // Toggle file as variable
  const toggleFileAsVariable = (id) => {
    setAttachedFiles(attachedFiles.map(file => 
      file.id === id ? { ...file, usedAsVariable: !file.usedAsVariable } : file
    ));
  };
  
  // Update file variable name
  const updateFileVariableName = (id, name) => {
    setAttachedFiles(attachedFiles.map(file => 
      file.id === id ? { ...file, variableName: name } : file
    ));
  };

  // Replace variables in prompt
  const previewWithVariables = () => {
    let text = playgroundInput || '';
    
    // Replace regular variables
    variables.forEach(variable => {
      const regex = new RegExp(`{{\s*${variable.name}\s*}}`, 'g');
      text = text.replace(regex, variable.value);
    });
    
    // Replace file variables
    attachedFiles
      .filter(file => file.usedAsVariable)
      .forEach(file => {
        const regex = new RegExp(`{{\s*${file.variableName}\s*}}`, 'g');
        text = text.replace(regex, `[FILE: ${file.name}]`);
      });
      
    return text;
  };
  
  // Toggle favorite status of a prompt
  const toggleFavorite = (promptId) => {
    setQuickAccessPrompts(quickAccessPrompts.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, favorite: !prompt.favorite } 
        : prompt
    ));
  };
  
  // Load prompt and settings
  const loadPrompt = (prompt) => {
    setPlaygroundInput(prompt.text);
    if (prompt.settings) {
      setModelSettings({
        ...modelSettings,
        ...prompt.settings
      });
    }
    
    // Add to recent executions
    const now = new Date();
    setRecentExecutions([
      { 
        id: Date.now(), 
        prompt: prompt.text.substring(0, 30) + "...", 
        timestamp: "Just now" 
      },
      ...recentExecutions.slice(0, 2)
    ]);
  };
  
  // Filter prompts based on active tab and search query
  const getFilteredPrompts = () => {
    let filtered = [...quickAccessPrompts];
    
    // Apply tab filter
    switch (quickAccessTab) {
      case 'favorites':
        filtered = filtered.filter(p => p.favorite);
        break;
      case 'recent':
        // Sort by last used date
        filtered.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));
        break;
      case 'popular':
        // Sort by usage count
        filtered.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.text.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  // Execute prompt action
  const executePrompt = () => {
    alert('Executing prompt with current settings...');
    
    // In a real app, this would send the prompt to the API with the model settings
    // and handle the response
    
    // Add to recent executions
    const now = new Date();
    setRecentExecutions([
      { 
        id: Date.now(), 
        prompt: playgroundInput.substring(0, 30) + "...", 
        timestamp: "Just now" 
      },
      ...recentExecutions.slice(0, 2)
    ]);
  };

  return (
    <div className="p-0 h-full bg-neutral-50 flex">
      {/* Main Content - Fixed scrolling issue */}
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
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-neutral-50 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">Prompt</span>
                {selectedPrompt && (
                  <span className="text-sm text-neutral-500">{selectedPrompt.title || "Untitled"}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  <Copy size={16} />
                </button>
                <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  <Save size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={playgroundInput || ''}
              onChange={(e) => setPlaygroundInput(e.target.value)}
              placeholder="Enter your prompt here... Use {{variable_name}} for variables"
              className="w-full p-4 min-h-[200px] border-none focus:outline-none focus:ring-0 resize-none text-neutral-800"
            />
            
            {/* Attached Files Display */}
            {attachedFiles.length > 0 && (
              <div className="p-3 bg-neutral-50 border-t border-neutral-200">
                <div className="text-sm text-neutral-600 mb-2">Attached Files:</div>
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map(file => (
                    <div 
                      key={file.id} 
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
                        file.usedAsVariable 
                          ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      <Paperclip size={14} className={file.usedAsVariable ? "text-primary-500" : "text-neutral-500"} />
                      <span>{file.name}</span>
                      <button 
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-neutral-400 hover:text-neutral-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Model Settings */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="flex flex-wrap lg:flex-nowrap">
              {/* Settings Tabs */}
              <div className="w-full lg:w-64 border-r border-neutral-200">
                <div className="p-3 font-medium text-neutral-700 bg-neutral-50 border-b border-neutral-200">
                  Settings
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => setActiveSettingsTab('general')}
                    className={`flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      activeSettingsTab === 'general' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Sliders size={16} />
                    <span>General</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveSettingsTab('variables')}
                    className={`flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      activeSettingsTab === 'variables' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="font-mono">{ }</span>
                    <span>Variables</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveSettingsTab('files')}
                    className={`flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      activeSettingsTab === 'files' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Paperclip size={16} />
                    <span>Files</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveSettingsTab('advanced')}
                    className={`flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      activeSettingsTab === 'advanced' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Settings size={16} />
                    <span>Advanced</span>
                  </button>
                </div>
              </div>
              
              {/* Settings Content */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                {/* General Settings */}
                {activeSettingsTab === 'general' && (
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
                )}
                
                {/* Variables Settings */}
                {activeSettingsTab === 'variables' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-neutral-700">Prompt Variables</h3>
                      <button 
                        onClick={() => setIsAddingVariable(true)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600"
                      >
                        <Plus size={14} />
                        Add Variable
                      </button>
                    </div>
                    
                    <p className="text-sm text-neutral-500">
                      Add variables to your prompt using the format: &#123;&#123;variable_name&#125;&#125;
                    </p>
                    
                    {isAddingVariable ? (
                      <div className="p-3 border border-neutral-200 rounded-lg bg-neutral-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              Variable Name
                            </label>
                            <input 
                              type="text" 
                              value={newVariable.name}
                              onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                              placeholder="e.g. customer_name"
                              className="w-full p-2 text-sm border border-neutral-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              Value
                            </label>
                            <input 
                              type="text" 
                              value={newVariable.value}
                              onChange={(e) => setNewVariable({...newVariable, value: e.target.value})}
                              placeholder="e.g. John Doe"
                              className="w-full p-2 text-sm border border-neutral-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Description (optional)
                          </label>
                          <input 
                            type="text" 
                            value={newVariable.description}
                            onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                            placeholder="e.g. Customer's full name"
                            className="w-full p-2 text-sm border border-neutral-300 rounded-md"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setIsAddingVariable(false)}
                            className="px-3 py-1 text-xs text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-100"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleAddVariable}
                            className="px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : null}
                    
                    {variables.length > 0 ? (
                      <div className="border border-neutral-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-neutral-50">
                            <tr className="border-b border-neutral-200">
                              <th className="px-4 py-2 text-left font-medium text-neutral-600">Name</th>
                              <th className="px-4 py-2 text-left font-medium text-neutral-600">Value</th>
                              <th className="px-4 py-2 text-left font-medium text-neutral-600">Description</th>
                              <th className="px-4 py-2 text-right font-medium text-neutral-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {variables.map(variable => (
                              <tr key={variable.id}>
                                <td className="px-4 py-3 font-mono">{variable.name}</td>
                                <td className="px-4 py-3">{variable.value}</td>
                                <td className="px-4 py-3 text-neutral-500">{variable.description}</td>
                                <td className="px-4 py-3 text-right">
                                  <button 
                                    onClick={() => handleDeleteVariable(variable.id)}
                                    className="p-1 text-neutral-400 hover:text-red-500"
                                  >
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
                    
                    {/* File variables */}
                    {attachedFiles.filter(file => file.usedAsVariable).length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-neutral-700 mb-2">File Variables</h3>
                        <div className="border border-neutral-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-neutral-50">
                              <tr className="border-b border-neutral-200">
                                <th className="px-4 py-2 text-left font-medium text-neutral-600">File</th>
                                <th className="px-4 py-2 text-left font-medium text-neutral-600">Variable Name</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                              {attachedFiles.filter(file => file.usedAsVariable).map(file => (
                                <tr key={file.id}>
                                  <td className="px-4 py-3 flex items-center gap-2">
                                    <FileText size={14} className="text-neutral-500" />
                                    {file.name}
                                  </td>
                                  <td className="px-4 py-3 font-mono">{file.variableName}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {(variables.length > 0 || attachedFiles.filter(file => file.usedAsVariable).length > 0) && (
                      <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <h4 className="text-sm font-medium text-neutral-700 mb-2">Preview with Variables</h4>
                        <div className="p-3 bg-white rounded border border-neutral-200 text-sm whitespace-pre-line">
                          {previewWithVariables()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Files Settings */}
                {activeSettingsTab === 'files' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-neutral-700">Attached Files</h3>
                      <label className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600 cursor-pointer">
                        <Paperclip size={14} />
                        Attach File
                        <input 
                          type="file" 
                          multiple 
                          onChange={handleFileAttachment} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    
                    <p className="text-sm text-neutral-500">
                      Files will be available to the model during processing. You can also use files as variables in your prompt.
                    </p>
                    
                    {attachedFiles.length > 0 ? (
                      <div className="border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="p-3 bg-neutral-50 border-b border-neutral-200 text-sm font-medium text-neutral-700">
                          {attachedFiles.length} File{attachedFiles.length !== 1 ? 's' : ''} Attached
                        </div>
                        <ul className="divide-y divide-neutral-200">
                          {attachedFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-3">
                                <Paperclip size={16} className="text-neutral-400" />
                                <div>
                                  <div className="text-neutral-800">{file.name}</div>
                                  <div className="text-xs text-neutral-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`use-as-var-${file.id}`}
                                    checked={file.usedAsVariable}
                                    onChange={() => toggleFileAsVariable(file.id)}
                                    className="mr-2"
                                  />
                                  <label htmlFor={`use-as-var-${file.id}`} className="text-sm">Use as variable</label>
                                </div>
                                
                                {file.usedAsVariable && (
                                  <input
                                    type="text"
                                    value={file.variableName}
                                    onChange={(e) => updateFileVariableName(file.id, e.target.value)}
                                    placeholder="Variable name"
                                    className="w-32 px-2 py-1 text-xs border border-neutral-300 rounded"
                                  />
                                )}
                                
                                <button 
                                  onClick={() => handleRemoveFile(file.id)}
                                  className="p-1 text-neutral-400 hover:text-red-500"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-6 text-center border border-dashed border-neutral-300 rounded-lg">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center">
                          <Paperclip size={20} className="text-neutral-400" />
                        </div>
                        <p className="text-neutral-500 mb-2">No files attached</p>
                        <label className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 cursor-pointer">
                          <Plus size={14} />
                          Browse Files
                          <input 
                            type="file" 
                            multiple 
                            onChange={handleFileAttachment} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}
                    
                    {attachedFiles.length > 0 && (
                      <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <h4 className="text-sm font-medium text-neutral-700 mb-2">Using Files in Prompts</h4>
                        <div className="text-sm text-neutral-600">
                          <p className="mb-2">Files can be used in two ways:</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Automatically processed by the model when referenced</li>
                            <li>Used as variables with the syntax: <code className="px-1 py-0.5 bg-neutral-100 rounded font-mono">{'{{'}file_variable_name{'}}'}</code></li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Advanced Settings */}
                {activeSettingsTab === 'advanced' && (
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
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Response Area */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-neutral-50 border-b border-neutral-200">
              <span className="font-medium text-neutral-700">Response</span>
              <div className="flex gap-2">
                <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 min-h-[200px] bg-neutral-50">
              <div className="animate-pulse flex flex-col gap-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          {/* Run Button */}
          <div className="flex justify-center">
            <button 
              onClick={executePrompt}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <PlayCircle size={20} />
              Run Prompt
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Access Panel - No space between main content and sidebar */}
      <div className="w-80 border-l border-neutral-200 bg-white overflow-y-auto h-full">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="font-medium text-neutral-700">Quick Access</h2>
          <p className="text-sm text-neutral-500">Saved and recent prompts</p>
        </div>
        
        <div className="p-3">
          {/* Search box */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-8 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Filter tabs */}
          <div className="flex border-b border-neutral-200 mb-3">
            <button 
              onClick={() => setQuickAccessTab('favorites')}
              className={`px-3 py-2 text-sm font-medium ${
                quickAccessTab === 'favorites' 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Star size={14} />
                Favorites
              </div>
            </button>
            <button 
              onClick={() => setQuickAccessTab('recent')}
              className={`px-3 py-2 text-sm font-medium ${
                quickAccessTab === 'recent' 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Clock size={14} />
                Recent
              </div>
            </button>
            <button 
              onClick={() => setQuickAccessTab('popular')}
              className={`px-3 py-2 text-sm font-medium ${
                quickAccessTab === 'popular' 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <TrendingUp size={14} />
                Popular
              </div>
            </button>
            <button 
              onClick={() => setQuickAccessTab('all')}
              className={`px-3 py-2 text-sm font-medium ${
                quickAccessTab === 'all' 
                  ? 'text-primary-600 border-b-2 border-primary-500' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              All
            </button>
          </div>
          
          {/* Prompt cards - Make container scrollable */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
            {getFilteredPrompts().map(prompt => (
              <div 
                key={prompt.id} 
                className="p-3 border border-neutral-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors cursor-pointer"
                onClick={() => loadPrompt(prompt)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-neutral-800">{prompt.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prompt.id);
                    }}
                    className={prompt.favorite ? "text-secondary-500" : "text-neutral-300 hover:text-secondary-500"}
                  >
                    <Star size={16} fill={prompt.favorite ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{prompt.text}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {prompt.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      loadPrompt(prompt);
                    }}
                    className="text-xs text-primary-600 font-medium hover:text-primary-700 ml-2"
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
            
            {getFilteredPrompts().length === 0 && (
              <div className="p-6 text-center text-neutral-500">
                {searchQuery
                  ? "No prompts found matching your search"
                  : quickAccessTab === 'favorites'
                    ? "No favorite prompts yet"
                    : "No prompts available"}
              </div>
            )}
          </div>
          
          {/* Recent Usage Section */}
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-700 flex items-center gap-1 mb-3">
              <Clock size={14} />
              Recent Activity
            </h3>
            
            <div className="space-y-2">
              {recentExecutions.map(item => (
                <div key={item.id} className="p-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="line-clamp-1">{item.prompt}</span>
                    <span className="text-xs text-neutral-400">{item.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {recentExecutions.length === 0 && (
                <div className="p-2 text-sm text-neutral-500 text-center">
                  No recent activity
                </div>
              )}
            </div>
          </div>
          
          {/* Documentation Link */}
          <div className="mt-6 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 rounded-md text-primary-600">
                <Book size={16} />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 text-sm">Need help?</h3>
                <p className="text-xs text-neutral-600 mt-1">Check out our prompt engineering guides for tips and best practices</p>
                <a href="#" className="text-xs text-primary-600 font-medium mt-2 inline-block hover:underline">
                  Open Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PlaygroundPage;