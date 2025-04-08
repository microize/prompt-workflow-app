import React, { useState } from 'react';

const WorkflowLibraryPage = () => {
  return (
    <div className="p-0 h-full bg-neutral-50">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold">Workflow Library</h2>
          <p className="text-sm text-neutral-500 mt-1">Browse and manage your saved workflows</p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowLibraryPage;