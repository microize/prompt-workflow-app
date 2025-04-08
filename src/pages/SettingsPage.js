import React, { useState } from 'react';
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
  Layout
} from 'lucide-react';

const SettingsPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for form inputs
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

  // Handle form changes
  const handleChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle API key changes
  const handleApiKeyChange = (provider, value) => {
    setFormState(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [provider]: value
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

  // Save settings
  const saveSettings = () => {
    // This would save to backend in a real app
    alert('Settings saved successfully!');
  };

  // Clear all data confirmation
  const confirmClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // Clear data logic would go here
      alert('All data has been cleared');
    }
  };

  return (
    <div className="p-0 h-full bg-neutral-50">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full">
        {/* Header - Removed gap between heading and content */}
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold">Settings</h2>
          <p className="text-sm text-neutral-500 mt-1">Configure your preferences and account settings</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'personal' 
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Personal</span>
            </div>
          </button>
          
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'api' 
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('api')}
          >
            <div className="flex items-center gap-2">
              <Key size={16} />
              <span>API Keys</span>
            </div>
          </button>
          
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'appearance' 
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            <div className="flex items-center gap-2">
              <Layout size={16} />
              <span>Appearance</span>
            </div>
          </button>
          
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'data' 
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
            onClick={() => setActiveTab('data')}
          >
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>Data Management</span>
            </div>
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 170px)' }}>
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
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
                      <Globe size={18} className="text-neutral-500" />
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
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-neutral-700 mb-4">Account Actions</h3>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
          
          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium mb-4">API Keys Configuration</h3>
                <p className="text-sm text-neutral-600 mb-6">
                  Configure API keys for various AI providers to use in your prompts and workflows.
                  Your keys are encrypted and stored securely.
                </p>
                
                <div className="space-y-4">
                  {/* OpenAI */}
                  <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">OpenAI API Key</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type={showApiKey.openai ? "text" : "password"}
                            value={formState.apiKeys.openai}
                            onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                            placeholder="Enter your OpenAI API key"
                            className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <button 
                            onClick={() => toggleShowApiKey('openai')} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showApiKey.openai ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">Models: GPT-3.5, GPT-4, GPT-4o, DALL-E</p>
                      </div>
                      <button className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50">
                        Verify
                      </button>
                    </div>
                  </div>
                  
                  {/* Anthropic */}
                  <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Anthropic API Key</h4>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Inactive</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type={showApiKey.anthropic ? "text" : "password"}
                            value={formState.apiKeys.anthropic}
                            onChange={(e) => handleApiKeyChange('anthropic', e.target.value)}
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
                      <button className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50">
                        Verify
                      </button>
                    </div>
                  </div>
                  
                  {/* Mistral */}
                  <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Mistral API Key</h4>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Inactive</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type={showApiKey.mistral ? "text" : "password"}
                            value={formState.apiKeys.mistral}
                            onChange={(e) => handleApiKeyChange('mistral', e.target.value)}
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
                      <button className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50">
                        Verify
                      </button>
                    </div>
                  </div>
                  
                  {/* Cohere */}
                  <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Cohere API Key</h4>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">Inactive</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type={showApiKey.cohere ? "text" : "password"}
                            value={formState.apiKeys.cohere}
                            onChange={(e) => handleApiKeyChange('cohere', e.target.value)}
                            placeholder="Enter your Cohere API key"
                            className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <button 
                            onClick={() => toggleShowApiKey('cohere')} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showApiKey.cohere ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">Models: Command, Command-R</p>
                      </div>
                      <button className="px-3 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50">
                        Verify
                      </button>
                    </div>
                  </div>
                  
                  {/* Add more providers here */}
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Save size={16} />
                  Save API Keys
                </button>
              </div>
            </div>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Display Settings</h3>
              
              <div className="p-4 border border-neutral-200 rounded-lg">
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
                      onClick={toggleDarkMode} 
                      className={`px-3 py-1 rounded-lg text-sm ${!formState.darkMode ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      <div className="flex items-center gap-1">
                        <Sun size={14} />
                        Light
                      </div>
                    </button>
                    <button 
                      onClick={toggleDarkMode} 
                      className={`px-3 py-1 rounded-lg text-sm ${formState.darkMode ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      <div className="flex items-center gap-1">
                        <Moon size={14} />
                        Dark
                      </div>
                    </button>
                    <button 
                      className="px-3 py-1 rounded-lg text-sm bg-neutral-100 text-neutral-600"
                    >
                      <div className="flex items-center gap-1">
                        <Monitor size={14} />
                        System
                      </div>
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
                    className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option>List View</option>
                    <option>Card View</option>
                    <option>Compact View</option>
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
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={saveSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}
          
          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <Download size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Export Prompts</h4>
                      <p className="text-sm text-neutral-500">Download all your prompts as JSON</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 mt-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2">
                    <Download size={16} />
                    Export Data
                  </button>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <Upload size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Import Prompts</h4>
                      <p className="text-sm text-neutral-500">Import prompts from JSON file</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 mt-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2">
                    <Upload size={16} />
                    Import Data
                  </button>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-neutral-200">
                <h4 className="font-medium text-red-600 mb-3">Danger Zone</h4>
                
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Clear All Data</h4>
                      <p className="text-sm text-neutral-500">This will permanently delete all your prompts, workflows, and preferences</p>
                    </div>
                  </div>
                  <button 
                    onClick={confirmClearData}
                    className="w-full px-4 py-2 mt-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;