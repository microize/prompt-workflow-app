import React from 'react';
import { Move, X } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';

const WorkflowNode = ({ node }) => {
  const {
    handleNodeMouseDown,
    startConnectionDraw,
    deleteNode,
    handleNodeTextChange
  } = useWorkflowContext();

  // Determine styling based on node type
  const getNodeColorClass = () => {
    switch (node.type) {
      case 'prompt':
        return 'bg-blue-50 border-blue-200';
      case 'action':
        return 'bg-purple-50 border-purple-200';
      case 'condition':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getHandleColorClass = () => {
    switch (node.type) {
      case 'prompt':
        return 'bg-blue-500';
      case 'action':
        return 'bg-purple-500';
      case 'condition':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`absolute rounded-lg shadow-sm border ${getNodeColorClass()}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: '200px'
      }}
    >
      {/* Node Header */}
      <div 
        className="p-3 border-b border-gray-200 cursor-move flex justify-between items-center"
        onMouseDown={(e) => handleNodeMouseDown(e, node)}
      >
        <div className="flex items-center gap-2">
          <Move size={14} className="text-gray-500" />
          <span className="font-medium text-sm">{node.title}</span>
        </div>
        <button 
          onClick={() => deleteNode(node.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <X size={14} />
        </button>
      </div>
      
      {/* Node Content */}
      <div className="p-3">
        <textarea
          className="w-full text-sm p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={node.content}
          onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
          rows={3}
        />
      </div>
      
      {/* Connection Handle */}
      <div 
        className={`absolute w-4 h-4 rounded-full ${getHandleColorClass()} cursor-crosshair right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2`}
        onMouseDown={(e) => startConnectionDraw(e, node)}
      />
    </div>
  );
};

export default WorkflowNode;