import React from 'react';

const SettingsPage = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold">App Settings</h2>
          <p className="text-sm text-neutral-500 mt-1">Configure your preferences for the application</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div className="border-b border-neutral-100 pb-6">
              <h3 className="text-lg font-medium mb-4 text-neutral-800">Interface Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50" 
                    />
                    <span className="ml-2">Dark Mode</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50" 
                    />
                    <span className="ml-2">Enable Notifications</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Results Display</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option>List View</option>
                    <option>Card View</option>
                    <option>Compact View</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border-b border-neutral-100 pb-6">
              <h3 className="text-lg font-medium mb-4 text-neutral-800">API Configuration</h3>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">API Key</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-neutral-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your API key"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-neutral-300 text-sm font-medium rounded-r-md text-neutral-700 bg-neutral-50 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save
                  </button>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Your API key is encrypted and stored securely
                </p>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Default Model</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                  <option>GPT-4</option>
                  <option>Claude</option>
                  <option>Gemini</option>
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-neutral-800">Data Management</h3>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Export Prompts
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md shadow-sm text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Import Prompts
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md shadow-sm text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;