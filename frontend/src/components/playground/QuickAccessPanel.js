import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Clock, 
  X, 
  BookOpen,
  Sparkles,
  PlayCircle
} from 'lucide-react';

const QuickAccessPanel = ({ 
  favorites = [], 
  recentPrompts = [], 
  popularPrompts = [],
  onUsePrompt 
}) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter prompts based on search query
  const filterPrompts = (prompts) => {
    if (!searchQuery.trim()) return prompts;
    
    return prompts.filter(prompt => 
      prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prompt.title && prompt.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prompt.tags && prompt.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  };
  
  // Get the prompts for the active tab
  const getActivePrompts = () => {
    switch (activeTab) {
      case 'favorites':
        return filterPrompts(favorites);
      case 'recent':
        return filterPrompts(recentPrompts);
      case 'popular':
        return filterPrompts(popularPrompts);
      default:
        return [];
    }
  };
  
  const activePrompts = getActivePrompts();

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
        <div className="flex border-b border-neutral-200 mb-3">
          <TabButton 
            label=""
            icon={<Star size={14} />}
            isActive={activeTab === 'favorites'}
            onClick={() => setActiveTab('favorites')}
            count={favorites.length}
          />
          <TabButton 
            label=""
            icon={<Clock size={14} />}
            isActive={activeTab === 'recent'}
            onClick={() => setActiveTab('recent')}
          />
          <TabButton 
            label=""
            icon={<Sparkles size={14} />}
            isActive={activeTab === 'popular'}
            onClick={() => setActiveTab('popular')}
          />
        </div>
        
        {/* Prompt cards */}
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
          {activePrompts.length === 0 ? (
            <EmptyState type={activeTab} searchQuery={searchQuery} />
          ) : (
            activePrompts.map(prompt => (
              <PromptCard 
                key={prompt.id}
                prompt={prompt}
                onUse={() => onUsePrompt(prompt)}
              />
            ))
          )}
        </div>
        
        {/* Documentation Link */}
        <div className="mt-6 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 rounded-md text-primary-600">
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 text-sm">Need help?</h3>
              <p className="text-xs text-neutral-600 mt-1">Check out our prompt engineering guides for tips and best practices</p>
              <button className="text-xs text-primary-600 font-medium mt-2 inline-block hover:underline">
                Open Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab button component
const TabButton = ({ label, icon, isActive, onClick, count }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium flex items-center gap-1 ${
      isActive 
        ? 'text-primary-600 border-b-2 border-primary-500' 
        : 'text-neutral-500 hover:text-neutral-700'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
        isActive 
          ? 'bg-primary-100 text-primary-700' 
          : 'bg-neutral-100 text-neutral-600'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// Empty state component
const EmptyState = ({ type, searchQuery }) => {
  const getContent = () => {
    if (searchQuery) {
      return {
        icon: <Search size={28} className="text-neutral-300" />,
        title: "No matching prompts",
        description: `No prompts found matching "${searchQuery}"`
      };
    }
    
    switch (type) {
      case 'favorites':
        return {
          icon: <Star size={28} className="text-neutral-300" />,
          title: "No favorites yet",
          description: "Favorite prompts will appear here"
        };
      case 'recent':
        return {
          icon: <Clock size={28} className="text-neutral-300" />,
          title: "No recent prompts",
          description: "Recently used prompts will appear here"
        };
      case 'popular':
        return {
          icon: <Sparkles size={28} className="text-neutral-300" />,
          title: "No popular prompts",
          description: "Popular prompts will appear here"
        };
      default:
        return {
          icon: <X size={28} className="text-neutral-300" />,
          title: "No prompts found",
          description: "Try a different search"
        };
    }
  };
  
  const content = getContent();
  
  return (
    <div className="p-8 text-center">
      <div className="mx-auto mb-2">{content.icon}</div>
      <p className="text-neutral-600 font-medium">{content.title}</p>
      <p className="text-neutral-500 text-sm">{content.description}</p>
    </div>
  );
};

// Prompt card component
const PromptCard = ({ prompt, onUse }) => (
  <div className="p-3 border border-neutral-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors cursor-pointer">
    <h4 className="font-medium text-neutral-800 text-sm flex justify-between">
      {prompt.title || prompt.text.substring(0, 30) + '...'}
      {prompt.favorite && <Star size={14} className="text-secondary-500 fill-secondary-500" />}
    </h4>
    
    <p className="mt-1 text-xs text-neutral-600 line-clamp-2">{prompt.text}</p>
    
    <div className="mt-2 flex items-center justify-between">
      <div className="flex gap-1 flex-wrap">
        {prompt.tags && prompt.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
        {prompt.category && !prompt.tags && (
          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
            {prompt.category}
          </span>
        )}
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onUse();
        }}
        className="text-xs flex items-center gap-1 px-2 py-1 bg-white border border-primary-200 text-primary-600 rounded-full hover:bg-primary-100"
      >
        <PlayCircle size={12} />
        Use
      </button>
    </div>
  </div>
);

export default QuickAccessPanel;