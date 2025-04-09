// src/components/playground/QuickAccessPanel.js
import React from 'react';
import { Search, Star, Clock, X, Book } from 'lucide-react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

const QuickAccessPanel = () => {
  const { 
    quickAccessTab,
    setQuickAccessTab,
    searchQuery,
    setSearchQuery,
    getFilteredPrompts,
    loadPrompt,
    toggleFavorite,
    recentExecutions
  } = usePlaygroundState();

  return (
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
          <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
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
        <QuickAccessTabs 
          activeTab={quickAccessTab}
          onChange={setQuickAccessTab}
        />
        
        {/* Prompt cards */}
        <PromptList 
          prompts={getFilteredPrompts()}
          onToggleFavorite={toggleFavorite}
          onLoadPrompt={loadPrompt}
        />
        
        {/* Recent Activity Section */}
        <RecentActivityPanel executions={recentExecutions} />
        
        {/* Documentation Link */}
        <DocumentationLink />
      </div>
    </div>
  );
};

// Helper components
const QuickAccessTabs = ({ activeTab, onChange }) => (
  <div className="flex border-b border-neutral-200 mb-3">
    <TabButton 
      label="Favorites"
      icon={<Star size={14} />}
      isActive={activeTab === 'favorites'}
      onClick={() => onChange('favorites')}
    />
    <TabButton 
      label="Recent"
      icon={<Clock size={14} />}
      isActive={activeTab === 'recent'}
      onClick={() => onChange('recent')}
    />
    <TabButton 
      label="Popular"
      icon={<TrendingUpIcon size={14} />}
      isActive={activeTab === 'popular'}
      onClick={() => onChange('popular')}
    />
    <TabButton 
      label="All"
      isActive={activeTab === 'all'}
      onClick={() => onChange('all')}
    />
  </div>
);

const TabButton = ({ label, icon, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium ${
      isActive 
        ? 'text-primary-600 border-b-2 border-primary-500' 
        : 'text-neutral-500 hover:text-neutral-700'
    }`}
  >
    {icon && (
      <div className="flex items-center gap-1">
        {icon}
        {label}
      </div>
    )}
    {!icon && label}
  </button>
);

const TrendingUpIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
  
  const PromptList = ({ prompts, onToggleFavorite, onLoadPrompt }) => {
    if (prompts.length === 0) {
      return (
        <div className="p-6 text-center text-neutral-500">
          No prompts found matching your criteria
        </div>
      );
    }
  
    return (
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
        {prompts.map(prompt => (
          <PromptCard 
            key={prompt.id}
            prompt={prompt}
            onToggleFavorite={onToggleFavorite}
            onUse={onLoadPrompt}
          />
        ))}
      </div>
    );
  };
  
  const PromptCard = ({ prompt, onToggleFavorite, onUse }) => (
    <div 
      className="p-3 border border-neutral-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors cursor-pointer"
      onClick={() => onUse(prompt)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-neutral-800">{prompt.title}</h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(prompt.id);
          }}
          className={prompt.favorite ? "text-secondary-500" : "text-neutral-300 hover:text-secondary-500"}
        >
          <Star size={16} fill={prompt.favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{prompt.text}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {prompt.tags && prompt.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUse(prompt);
          }}
          className="text-xs text-primary-600 font-medium hover:text-primary-700 ml-2"
        >
          Use
        </button>
      </div>
    </div>
  );
  
  const RecentActivityPanel = ({ executions }) => (
    <div className="mt-6 pt-4 border-t border-neutral-200">
      <h3 className="text-sm font-medium text-neutral-700 flex items-center gap-1 mb-3">
        <Clock size={14} />
        Recent Activity
      </h3>
      
      <div className="space-y-2">
        {executions.length > 0 ? (
          executions.map(item => (
            <div key={item.id} className="p-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="line-clamp-1">{item.prompt}</span>
                <span className="text-xs text-neutral-400">{item.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-neutral-500 text-center">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
  
  const DocumentationLink = () => (
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
  );
  
  export default QuickAccessPanel;
  
  