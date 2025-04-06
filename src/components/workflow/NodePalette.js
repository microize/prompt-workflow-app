import React from 'react';
import { Sparkles, ArrowRight, GitBranch } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';

const NodePalette = ({ workflows }) => {
  const { addNewNode } = useWorkflowContext();

  return (
    <div className="w-64 p-4 border-r">
      <h3 className="font-medium text-gray-700 mb-4">Components</h3>
      
      <div className="space-y-3">
        <div 
          className="bg-blue-50 border border-blue-100 p-3 rounded-lg cursor-move flex items-center gap-2"
          draggable="true"
          onDragEnd={() => addNewNode('prompt')}
        >
          <Sparkles size={16} className="text-blue-500" />
          <div>
            <p className="font-medium text-sm">Prompt Node</p>
            <p className="text-xs text-gray-500">AI prompt template</p>
          </div>
        </div>
        
        <div 
          className="bg-purple-50 border border-purple-100 p-3 rounded-lg cursor-move flex items-center gap-2"
          draggable="true"
          onDragEnd={() => addNewNode('action')}
        >
          <ArrowRight size={16} className="text-purple-500" />
          <div>
            <p className="font-medium text-sm">Action Node</p>
            <p className="text-xs text-gray-500">Process or transform</p>
          </div>
        </div>
        
        <div 
          className="bg-amber-50 border border-amber-100 p-3 rounded-lg cursor-move flex items-center gap-2"
          draggable="true"
          onDragEnd={() => addNewNode('condition')}
        >
          <GitBranch size={16} className="text-amber-500" />
          <div>
            <p className="font-medium text-sm">Condition Node</p>
            <p className="text-xs text-gray-500">Branch your workflow</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-3">Templates</h3>
        
        <div className="space-y-2">
          {workflows.map(workflow => (
            <div key={workflow.id} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
              <p className="font-medium text-sm">{workflow.name}</p>
              <p className="text-xs text-gray-500 mt-1">{workflow.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {workflow.category}
                </span>
                <span className="text-xs text-gray-500">{workflow.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodePalette;