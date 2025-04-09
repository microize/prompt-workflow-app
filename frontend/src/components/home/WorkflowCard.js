import React from 'react';
import { PlayCircle, Star, GitBranch } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const WorkflowCard = ({ workflow, type }) => {
  const { openWorkflow, toggleFavoriteWorkflow, favoriteWorkflows } = useAppContext();
  
  const isFavorite = favoriteWorkflows.some(f => f.id === workflow.id);

  // Determine which metadata to show based on the card type
  const renderMetadata = () => {
    switch (type) {
      case 'recent':
        return <span className="text-xs text-neutral-500 ml-2">{workflow.lastUsed}</span>;
      case 'popular':
        return (
          <div className="flex items-center text-secondary-500">
            <Star size={14} strokeWidth={1.75} className="mr-1 fill-secondary-500" />
            <span className="text-xs font-medium">{workflow.usageCount || 0}</span>
          </div>
        );
      case 'favorite':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteWorkflow(workflow);
            }}
            className="text-secondary-500"
          >
            <Star size={16} strokeWidth={1.75} className="fill-secondary-500" />
          </button>
        );
      default:
        return null;
    }
  };

  // Get category style
  const getCategoryStyle = () => {
    switch (workflow.category) {
      case 'development':
        return 'bg-indigo-50/70 text-indigo-600 border border-indigo-100';
      case 'marketing':
        return 'bg-secondary-50/70 text-secondary-600 border border-secondary-100';
      case 'writing':
        return 'bg-success-50/70 text-success-500 border border-success-100';
      case 'business':
        return 'bg-blue-50/70 text-blue-600 border border-blue-100';
      default:
        return 'bg-neutral-100/70 text-neutral-600 border border-neutral-200';
    }
  };

  // Additional metadata for favorites
  const renderFavoriteExtras = () => {
    if (type === 'favorite') {
      return (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-neutral-500">{workflow.addedAt || 'Recently added'}</span>
          <button 
            onClick={() => openWorkflow(workflow)}
            className="text-primary-600 text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <GitBranch size={14} strokeWidth={1.75} />
            Open
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 hover:bg-neutral-50 transition-all duration-200 cursor-pointer rounded-md">
      <div className="flex justify-between pr-1">
        <p className="text-neutral-700 line-clamp-1 pr-2 text-sm">{workflow.name}</p>
        {renderMetadata()}
      </div>
      <p className="text-neutral-500 text-xs mt-1 line-clamp-2">{workflow.description}</p>
      <div className="flex mt-3 justify-between">
        <span className={`px-3 py-1 rounded-full text-xs ${getCategoryStyle()}`}>
          {workflow.category}
        </span>
        {type !== 'favorite' ? (
          <button 
            onClick={() => openWorkflow(workflow)}
            className="text-primary-600 text-xs flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <GitBranch size={14} strokeWidth={1.75} />
            Open Workflow
          </button>
        ) : renderFavoriteExtras()}
      </div>
    </div>
  );
};

export default WorkflowCard;