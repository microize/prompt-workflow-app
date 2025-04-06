import React from 'react';
import { Clock, TrendingUp, Star } from 'lucide-react';
import PromptCard from './PromptCard';

const PromptCollection = ({ title, icon, prompts, type }) => {
  // Function to get the appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case 'clock':
        return <Clock size={18} className="text-gray-500 mr-2" />;
      case 'trending':
        return <TrendingUp size={18} className="text-gray-500 mr-2" />;
      case 'star':
        return <Star size={18} className="text-amber-500 mr-2 fill-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center px-4 py-3 border-b">
        {getIcon()}
        <h2 className="text-lg font-semibold">{title}</h2>
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
          <div className="p-6 text-center text-gray-500">
            No favorites yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCollection;