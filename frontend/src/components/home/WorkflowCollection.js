import React from 'react';
import { GitBranch, TrendingUp, Star } from 'lucide-react';
import WorkflowCard from './WorkflowCard';

const WorkflowCollection = ({ title, icon, workflows, type }) => {
  // Function to get the appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case 'clock':
        return <GitBranch size={18} strokeWidth={1.75} className="text-primary-500" />;
      case 'trending':
        return <TrendingUp size={18} strokeWidth={1.75} className="text-secondary-500" />;
      case 'star':
        return <Star size={18} strokeWidth={1.75} className="text-secondary-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow transition-all duration-200 flex flex-col">
      <div className="flex items-center px-5 py-3 border-b border-neutral-100">
        {getIcon()}
        <h2 className="ml-2 text-[15px] font-medium text-neutral-700">{title}</h2>
      </div>
      
      {/* Scrollable container with custom scrollbar */}
      <div className="divide-y divide-neutral-100/70 overflow-y-auto hide-scrollbar flex-1 smooth-scroll-container" 
           style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {workflows.map(workflow => (
          <WorkflowCard 
            key={workflow.id} 
            workflow={workflow} 
            type={type} 
          />
        ))}
        {workflows.length === 0 && type === 'favorite' && (
          <div className="p-8 text-center">
            <Star size={28} strokeWidth={1.75} className="mx-auto mb-2 text-neutral-300" />
            <p className="text-neutral-500">No favorite workflows yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCollection;