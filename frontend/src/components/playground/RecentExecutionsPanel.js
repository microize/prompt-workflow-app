// src/components/playground/RecentExecutionsPanel.js
import React from 'react';
import { Clock } from 'lucide-react';

const RecentExecutionsPanel = () => {
  const { recentExecutions } = usePlaygroundState();

  return (
    <div className="mt-6 pt-4 border-t border-neutral-200">
      <h3 className="text-sm font-medium text-neutral-700 flex items-center gap-1 mb-3">
        <Clock size={14} />
        Recent Executions
      </h3>
      
      <div className="space-y-2">
        {recentExecutions.map(item => (
          <div key={item.id} className="p-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="line-clamp-1">{item.prompt}</span>
              <span className="text-xs text-neutral-400">{item.timestamp}</span>
            </div>
          </div>
        ))}
        
        {recentExecutions.length === 0 && (
          <div className="p-2 text-sm text-neutral-500 text-center">
            No recent executions
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentExecutionsPanel;