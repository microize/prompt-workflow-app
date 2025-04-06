import React, { useRef } from 'react';
import { Move, X } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';

const WorkflowNode = ({ node }) => {
  const {
    handleNodeMouseDown,
    startConnectionDraw,
    endConnectionDraw,
    deleteNode,
    handleNodeTextChange
  } = useWorkflowContext();

  const inputHandleRef = useRef(null);
  const outputHandleRef = useRef(null);

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
      className={`absolute rounded-lg shadow-md border ${getNodeColorClass()}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: '200px',
        zIndex: 10
      }}
      data-node-id={node.id}
      data-node-type={node.type}
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
          className="text-gray-400 hover:text-red-500 transition-colors"
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
          placeholder={`Enter ${node.type} details...`}
        />
      </div>
      
      {/* Input Connection Handle */}
      <div 
        ref={inputHandleRef}
        className="absolute w-6 h-6 rounded-full bg-gray-400 cursor-crosshair left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                   flex items-center justify-center hover:scale-110 transition-transform"
        style={{ zIndex: 20 }}
        data-handle-type="input"
        data-node-id={node.id}
        onMouseUp={(e) => endConnectionDraw(e, node, 'input')}
      >
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
      
      {/* Output Connection Handle */}
      <div 
        ref={outputHandleRef}
        className={`absolute w-6 h-6 rounded-full ${getHandleColorClass()} cursor-crosshair right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2
                   flex items-center justify-center hover:scale-110 transition-transform`}
        style={{ zIndex: 20 }}
        data-handle-type="output"
        data-node-id={node.id}
        onMouseDown={(e) => startConnectionDraw(e, node, 'output')}
      >
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default WorkflowNode;