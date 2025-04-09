// src/hooks/usePlaygroundState.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export const usePlaygroundState = () => {
  const { playgroundInput, setPlaygroundInput, selectedPrompt } = useAppContext();
  
  // Settings state
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  
  // Variables state
  const [variables, setVariables] = useState([
    { id: 1, name: 'username', value: 'John Doe', description: 'User\'s full name' },
    { id: 2, name: 'company', value: 'Acme Corp', description: 'Company name' }
  ]);
  const [newVariable, setNewVariable] = useState({ name: '', value: '', description: '' });
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  
  // Files state
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
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
  
  // Response state
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Quick access state
  const [quickAccessTab, setQuickAccessTab] = useState('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample quick access prompts for demonstration
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
    // Other sample prompts...
  ]);
  
  // Recent executions
  const [recentExecutions, setRecentExecutions] = useState([
    { id: 1, prompt: "Write a product description for...", timestamp: "2h ago" },
    { id: 2, prompt: "Create a marketing email for...", timestamp: "Yesterday" },
    { id: 3, prompt: "Analyze customer feedback...", timestamp: "2 days ago" }
  ]);

  // Handle model setting changes
  const handleModelSettingChange = useCallback((setting, value) => {
    setModelSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);

  // Add a new variable
  const handleAddVariable = useCallback((variableObj) => {
    if (typeof variableObj === 'object') {
      setVariables(prev => [
        ...prev,
        {
          id: Date.now(),
          name: variableObj.name,
          value: variableObj.value,
          description: variableObj.description || ''
        }
      ]);
      setIsAddingVariable(false);
      return;
    }

    if (newVariable.name.trim() === '') return;

    setVariables(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newVariable.name,
        value: newVariable.value,
        description: newVariable.description
      }
    ]);

    setNewVariable({ name: '', value: '', description: '' });
    setIsAddingVariable(false);
  }, [newVariable]);

  // Delete a variable
  const handleDeleteVariable = useCallback((id) => {
    setVariables(prev => prev.filter(variable => variable.id !== id));
  }, []);

  // Handle file attachment with auto variable creation
  const handleFileAttachment = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles = files.map(file => {
      const variableName = file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase();
      return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        usedAsVariable: true,
        variableName: variableName
      };
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
  }, []);

  // Remove attached file
  const handleRemoveFile = useCallback((id) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== id));
  }, []);
  
  // Toggle file as variable
  const toggleFileAsVariable = useCallback((id) => {
    setAttachedFiles(prev => prev.map(file => {
      if (file.id === id) {
        const updatedFile = { 
          ...file, 
          usedAsVariable: !file.usedAsVariable 
        };

        if (updatedFile.usedAsVariable && !updatedFile.variableName) {
          updatedFile.variableName = file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase();
        }

        return updatedFile;
      }
      return file;
    }));
  }, []);
  
  // Update file variable name with improved handling
  const updateFileVariableName = useCallback((id, name) => {
    const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

    setAttachedFiles(prev => prev.map(file => 
      file.id === id ? { ...file, variableName: cleanName } : file
    ));
  }, []);

  // Replace variables in prompt with more comprehensive handling for files
  const previewWithVariables = useCallback(() => {
    let text = playgroundInput || '';

    variables.forEach(variable => {
      const regex = new RegExp(`{{\s*${variable.name}\s*}}`, 'g');
      text = text.replace(regex, variable.value);
    });

    attachedFiles
      .filter(file => file.usedAsVariable)
      .forEach(file => {
        const varName = file.variableName || file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase();
        const regex = new RegExp(`{{\s*${varName}\s*}}`, 'g');
        text = text.replace(regex, `[FILE: ${file.name}]`);
      });

    return text;
  }, [playgroundInput, variables, attachedFiles]);
  
  // Toggle favorite status of a prompt
  const toggleFavorite = useCallback((promptId) => {
    setQuickAccessPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, favorite: !prompt.favorite } 
        : prompt
    ));
  }, []);
  
  // Load prompt and settings
  const loadPrompt = useCallback((prompt) => {
    if (!prompt) return;
    
    setPlaygroundInput(prompt.text);
    if (prompt.settings) {
      setModelSettings(prev => ({
        ...prev,
        ...prompt.settings
      }));
    }
    
    // Add to recent executions
    const now = new Date();
    setRecentExecutions(prev => [
      { 
        id: Date.now(), 
        prompt: prompt.text.substring(0, 30) + "...", 
        timestamp: "Just now" 
      },
      ...prev.slice(0, 2)
    ]);
  }, [setPlaygroundInput]);
  
  // Filter prompts based on active tab and search query
  const getFilteredPrompts = useCallback(() => {
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
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return filtered;
  }, [quickAccessPrompts, quickAccessTab, searchQuery]);
  
  // Execute prompt action
  const executePrompt = useCallback(() => {
    if (!playgroundInput.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setResponse(`This is a simulated response to your prompt: "${playgroundInput.substring(0, 30)}..."`);
      setIsGenerating(false);
      
      // Add to recent executions
      setRecentExecutions(prev => [
        { 
          id: Date.now(), 
          prompt: playgroundInput.substring(0, 30) + "...", 
          timestamp: "Just now" 
        },
        ...prev.slice(0, 2)
      ]);
    }, 2000);
  }, [playgroundInput]);

  return {
    // State
    activeSettingsTab,
    setActiveSettingsTab,
    variables,
    newVariable,
    isAddingVariable,
    setIsAddingVariable,
    setNewVariable,
    attachedFiles,
    fileInputRef,
    modelSettings,
    response,
    isGenerating,
    quickAccessTab,
    setQuickAccessTab,
    searchQuery,
    setSearchQuery,
    quickAccessPrompts,
    recentExecutions,
    playgroundInput,
    setPlaygroundInput,
    
    // Actions
    handleModelSettingChange,
    handleAddVariable,
    handleDeleteVariable,
    handleFileAttachment,
    handleRemoveFile,
    toggleFileAsVariable,
    updateFileVariableName,
    previewWithVariables,
    toggleFavorite,
    loadPrompt,
    getFilteredPrompts,
    executePrompt
  };
};