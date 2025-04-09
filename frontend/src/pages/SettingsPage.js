import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Key, 
  Save, 
  Moon, 
  Sun, 
  Monitor, 
  EyeOff, 
  Eye, 
  Check, 
  AlertCircle,
  Download,
  Upload,
  Trash2,
  LogOut,
  Globe,
  Bell,
  Layout,
  CheckCircle,
  Info,
  X
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const SettingsPage = () => {
  // State for active tab and form inputs
  const [activeTab, setActiveTab] = useState('personal');
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Form state
  const [formState, setFormState] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    language: 'english',
    notifications: true,
    darkMode: false,
    apiKeys: {
      openai: '••••••••••••••••••••••••••',
      anthropic: '',
      cohere: '',
      replicate: '',
      huggingface: '',
      mistral: ''
    },
    interface: {
      layout: 'default',
      theme: 'system',
      fontSize: 'medium',
      density: 'comfortable'
    }
  });

  // State for showing/hiding API keys
  const [showApiKey, setShowApiKey] = useState({
    openai: false,
    anthropic: false,
    cohere: false,
    replicate: false,
    huggingface: false,
    mistral: false
  });

  // Reference to the form sections for smooth scrolling
  const sectionRefs = {
    personal: useRef(null),
    api: useRef(null),
    appearance: useRef(null),
    data: useRef(null)
  };

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalState, setOriginalState] = useState(formState);

  // Check for changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formState) !== JSON.stringify(originalState);
    setHasUnsavedChanges(hasChanges);
  }, [formState, originalState]);

  // Handle tab switching with confirmation if there are unsaved changes
  const handleTabChange = (tab) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to switch tabs?')) {
        setActiveTab(tab);
        scrollToTab(tab);
      }
    } else {
      setActiveTab(tab);
      scrollToTab(tab);
    }
  };

  // Scroll to the selected tab's section
  const scrollToTab = (tab) => {
    if (sectionRefs[tab] && sectionRefs[tab].current) {
      sectionRefs[tab].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested field changes
  const handleNestedChange = (parent, field, value) => {
    setFormState(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Toggle show/hide for API keys
  const toggleShowApiKey = (provider) => {
    setShowApiKey(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setFormState(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setFormState(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };

  // Save settings with animation
  const saveSettings = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setOriginalState(formState);
      setHasUnsavedChanges(false);
      
      // Show success toast
      showToastMessage('Settings saved successfully', 'success');
      
      // Reset status after delay
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }, 1000);
  };

  // Show toast message
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // Clear all data confirmation
  const confirmClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // Simulate API call
      setTimeout(() => {
        showToastMessage('All data has been cleared', 'success');
      }, 1000);
    }
  };

  // Handle API key verification
  const verifyApiKey = (provider) => {
    // Simulate verification process
    showToastMessage(`Verifying ${provider} API key...`, 'info');
    
    setTimeout(() => {
      if (formState.apiKeys[provider] && formState.apiKeys[provider].length > 10) {
        showToastMessage(`${provider} API key verified successfully`, 'success');
      } else {
        showToastMessage(`Invalid ${provider} API key`, 'error');
      }
    }, 1500);
  };

  return (
    <div className="p-0 h-full bg-neutral-50">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full flex">
        {/* Left sidebar with tabs */}
        <div className="w-64 border-r border-neutral-200 overflow-y-auto">
          <div className="py-6 px-4">
            <h2 className="text-xl font-semibold mb-1">Settings</h2>
            <p className="text-sm text-neutral-500 mb-6">Configure your preferences</p>
            
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      activeTab === 'personal' 
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                    onClick={() => handleTabChange('personal')}
                  >
                    <User size={18} className="mr-3" />
                    <span>Account</span>
                  </button>
                </li>
                
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      activeTab === 'api' 
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                    onClick={() => handleTabChange('api')}
                  >
                    <Key size={18} className="mr-3" />
                    <span>API Keys</span>
                  </button>
                </li>
                
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      activeTab === 'appearance' 
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                    onClick={() => handleTabChange('appearance')}
                  >
                    <Layout size={18} className="mr-3" />
                    <span>Appearance</span>
                  </button>
                </li>
                
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      activeTab === 'data' 
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                    onClick={() => handleTabChange('data')}
                  >
                    <Download size={18} className="mr-3" />
                    <span>Data Management</span>
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <button
                className="w-full flex items-center px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto" id="settings-content">
          <div className="max-w-3xl mx-auto py-8 px-6">
            {/* Personal Tab Content */}
            <div ref={sectionRefs.personal} id="personal-section" className="mb-12">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User size={20} className="mr-2 text-primary-500" />
                Account Settings
              </h2>
              
              <Card className="mb-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6 p-6">
                  <div className="w-24 h-24 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
                    <User size={32} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formState.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formState.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred Language</label>
                      <select
                        value={formState.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <Bell size={18} className="text-neutral-500" />
                        <span className="text-neutral-700">Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formState.notifications} 
                          onChange={toggleNotifications}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* API Keys Tab Content */}
            <div ref={sectionRefs.api} id="api-section" className="mb-12">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Key size={20} className="mr-2 text-primary-500" />
                API Keys Configuration
              </h2>
              
              <Card className="mb-6">
                <div className="p-6">
                  <p className="text-sm text-neutral-600 mb-6">
                    Configure API keys for various AI providers to use in your prompts and workflows.
                    Your keys are encrypted and stored securely.
                  </p>
                  
                  <div className="space-y-4">
                    {/* OpenAI */}
                    <div className="p-5 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors group">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          OpenAI API Key
                        </h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type={showApiKey.openai ? "text" : "password"}
                              value={formState.apiKeys.openai}
                              onChange={(e) => handleNestedChange('apiKeys', 'openai', e.target.value)}
                              placeholder="Enter your OpenAI API key"
                              className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            />
                            <button 
                              onClick={() => toggleShowApiKey('openai')} 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showApiKey.openai ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">Models: GPT-4, GPT-4o, DALL-E</p>
                        </div>
                        <button 
                          onClick={() => verifyApiKey('openai')}
                          className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                    
                    {/* Anthropic */}
                    <div className="p-5 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="w-2 h-2 rounded-full bg-neutral-400 mr-2"></span>
                          Anthropic API Key
                        </h4>
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Inactive</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type={showApiKey.anthropic ? "text" : "password"}
                              value={formState.apiKeys.anthropic}
                              onChange={(e) => handleNestedChange('apiKeys', 'anthropic', e.target.value)}
                              placeholder="Enter your Anthropic API key"
                              className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button 
                              onClick={() => toggleShowApiKey('anthropic')} 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showApiKey.anthropic ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">Models: Claude 3 Opus, Sonnet, Haiku</p>
                        </div>
                        <button 
                          onClick={() => verifyApiKey('anthropic')}
                          className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                    
                    {/* Mistral */}
                    <div className="p-5 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="w-2 h-2 rounded-full bg-neutral-400 mr-2"></span>
                          Mistral API Key
                        </h4>
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Inactive</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type={showApiKey.mistral ? "text" : "password"}
                              value={formState.apiKeys.mistral}
                              onChange={(e) => handleNestedChange('apiKeys', 'mistral', e.target.value)}
                              placeholder="Enter your Mistral API key"
                              className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button 
                              onClick={() => toggleShowApiKey('mistral')} 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showApiKey.mistral ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">Models: Mistral Small, Medium, Large</p>
                        </div>
                        <button 
                          onClick={() => verifyApiKey('mistral')}
                          className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Appearance Tab Content */}
            <div ref={sectionRefs.appearance} id="appearance-section" className="mb-12">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Layout size={20} className="mr-2 text-primary-500" />
                Appearance Settings
              </h2>
              
              <Card className="mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-6">Display Settings</h3>
                  
                  <div className="p-5 border border-neutral-200 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {formState.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        <div>
                          <h4 className="font-medium">Theme Mode</h4>
                          <p className="text-sm text-neutral-500">Choose between light and dark theme</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleNestedChange('interface', 'theme', 'light')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                            formState.interface.theme === 'light' 
                              ? 'bg-primary-100 text-primary-700 font-medium' 
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          <Sun size={14} />
                          Light
                        </button>
                        <button 
                          onClick={() => handleNestedChange('interface', 'theme', 'dark')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                            formState.interface.theme === 'dark' 
                              ? 'bg-primary-100 text-primary-700 font-medium' 
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          <Moon size={14} />
                          Dark
                        </button>
                        <button 
                          onClick={() => handleNestedChange('interface', 'theme', 'system')}
                          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                            formState.interface.theme === 'system' 
                              ? 'bg-primary-100 text-primary-700 font-medium' 
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          <Monitor size={14} />
                          System
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Interface Preferences</h4>
                    
                    <div className="flex items-center justify-between py-3 px-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Layout size={18} className="text-neutral-500" />
                        <span className="text-neutral-700">Default View Mode</span>
                      </div>
                      <select
                        value={formState.interface.layout}
                        onChange={(e) => handleNestedChange('interface', 'layout', e.target.value)}
                        className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="default">Default View</option>
                        <option value="compact">Compact View</option>
                        <option value="comfortable">Comfortable View</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 px-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bell size={18} className="text-neutral-500" />
                        <span className="text-neutral-700">Notification Sounds</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formState.notifications} 
                          onChange={toggleNotifications}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 px-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">Aa</span>
                        <span className="text-neutral-700">Font Size</span>
                      </div>
                      <select
                        value={formState.interface.fontSize}
                        onChange={(e) => handleNestedChange('interface', 'fontSize', e.target.value)}
                        className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Data Management Tab Content */}
            <div ref={sectionRefs.data} id="data-section" className="mb-12">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Download size={20} className="mr-2 text-primary-500" />
                Data Management
              </h2>
              
              <Card className="mb-6">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          <Download size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium">Export Prompts</h4>
                          <p className="text-sm text-neutral-500">Download all your prompts as JSON</p>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2.5 mt-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2">
                        <Download size={16} />
                        Export Data
                      </button>
                    </div>
                    
                    <div className="p-5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          <Upload size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium">Import Prompts</h4>
                          <p className="text-sm text-neutral-500">Import prompts from JSON file</p>
                        </div>
                      </div>
                      <label className="w-full px-4 py-2.5 mt-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <Upload size={16} />
                        <span>Import Data</span>
                        <input type="file" className="hidden" accept=".json" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-neutral-200">
                    <h4 className="font-medium text-red-600 mb-3 flex items-center">
                      <AlertCircle size={18} className="mr-2" />
                      Danger Zone
                    </h4>
                    
                    <div className="p-5 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <Trash2 size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium">Clear All Data</h4>
                          <p className="text-sm text-neutral-500">This will permanently delete all your prompts, workflows, and preferences</p>
                        </div>
                      </div>
                      <button 
                        onClick={confirmClearData}
                        className="w-full px-4 py-2.5 mt-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Clear All Data
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fixed save button at the bottom - Only shown when changes are made */}
            {hasUnsavedChanges && (
              <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-neutral-200 z-10 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600">You have unsaved changes</span>
                  <Button
                    onClick={saveSettings}
                    variant="primary"
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </span>
                    ) : saveStatus === 'success' ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        Saved
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save size={16} />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-fade-in ${
          toastType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          toastType === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {toastType === 'success' ? <CheckCircle size={18} /> :
           toastType === 'error' ? <AlertCircle size={18} /> :
           <Info size={18} />}
          <span>{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;