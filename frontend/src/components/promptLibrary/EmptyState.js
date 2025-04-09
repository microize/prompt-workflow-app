// src/components/promptLibrary/EmptyState.js
import React from 'react';
import { Search, Plus } from 'lucide-react';
import Button from '../common/Button';

const EmptyState = ({ onCreatePrompt, onResetFilters, hasPrompts }) => {
  return (
    <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 flex-grow flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <Search size={24} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-700 mb-2">No prompts found</h3>
      <p className="text-neutral-500 mb-6 max-w-md">
        {hasPrompts 
          ? "No results match your current search or filters. Try adjusting your criteria." 
          : "Your prompt library is empty. Create your first prompt to get started."}
      </p>
      
      {hasPrompts ? (
        <Button 
          variant="outline" 
          onClick={onResetFilters}
        >
          Clear Filters
        </Button>
      ) : (
        <Button 
          variant="primary" 
          onClick={onCreatePrompt}
          startIcon={<Plus size={18} />}
        >
          Create Prompt
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

