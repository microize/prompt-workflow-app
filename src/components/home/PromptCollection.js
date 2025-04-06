import React from 'react';
import { Clock, TrendingUp, Star } from 'lucide-react';
import PromptCard from './PromptCard';

const PromptCollection = ({ title, icon, prompts, type }) => {
  // Function to get the appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case 'clock':
        return <Clock size={18} className="text-[#4285f4]" />;
      case 'trending':
        return <TrendingUp size={18} className="text-[#fbbc04]" />;
      case 'star':
        return <Star size={18} className="text-[#fbbc04]" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center px-5 py-3 border-b border-gray-100">
        {getIcon()}
        <h2 className="ml-2 text-[15px] font-medium text-[#3c4043]">{title}</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {prompts.map(prompt => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            type={type} 
          />
        ))}
        {prompts.length === 0 && type === 'favorite' && (
          <div className="p-8 text-center">
            <Star size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-[#5f6368]">No favorites yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCollection;