import React from 'react';
import { Clock, TrendingUp, Star } from 'lucide-react';
import PromptCard from './PromptCard';

const PromptCollection = ({ title, icon, prompts, type }) => {
  // Function to get the appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case 'clock':
        return <Clock size={18} className="text-primary-500" />;
      case 'trending':
        return <TrendingUp size={18} className="text-secondary-500" />;
      case 'star':
        return <Star size={18} className="text-secondary-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col">
      <div className="flex items-center px-5 py-3 border-b border-neutral-100">
        {getIcon()}
        <h2 className="ml-2 text-[15px] font-medium text-neutral-700">{title}</h2>
      </div>
      
      {/* Scrollable container with custom scrollbar */}
      <div className="divide-y divide-neutral-100 overflow-y-auto hide-scrollbar flex-1 smooth-scroll-container scroll-container" 
           style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {prompts.map(prompt => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            type={type} 
          />
        ))}
        {prompts.length === 0 && type === 'favorite' && (
          <div className="p-8 text-center">
            <Star size={28} className="mx-auto mb-2 text-neutral-300" />
            <p className="text-neutral-600">No favorites yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCollection;