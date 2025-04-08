import React, { useState, useEffect } from 'react';

const PromptHistoryPage = () => {
  return (
    <div className="p-0 h-full bg-neutral-50">
     
        <div className="p-4 border-b border-neutral-100">
          {/* Reduced padding from p-6 to p-4 */}
          <h2 className="text-xl font-semibold">Prompt History</h2>
          <p className="text-sm text-neutral-500 mt-1">View and manage your previous prompt executions</p>
        </div>

    </div>
  );
};

export default PromptHistoryPage;