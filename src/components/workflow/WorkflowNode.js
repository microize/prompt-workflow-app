import React, { useRef, useState } from 'react';
import { Move, X, Copy, Edit, Check } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';

const WorkflowNode = ({ node }) => {
  const {
    handleNodeMouseDown,
    startConnectionDraw,
    endConnectionDraw,
    deleteNode,
    duplicateNode,
    handleNodeTextChange,
    handleNodeTitleChange
  } = useWorkflowContext();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(node.title);
  
  const inputHandleRef = useRef(null);
  const outputHandleRef = useRef(null);
  const titleInputRef = useRef(null);

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

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 10);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() !== '') {
      handleNodeTitleChange(node.id, titleValue);
    } else {
      setTitleValue(node.title);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitleValue(node.title);
      setIsEditingTitle(false);
    }
  };

  const handleDuplicateNode = (e) => {
    e.stopPropagation();
    duplicateNode(node.id);
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
        className="p-3 border-b border-gray-200 cursor-move flex justify-between items-center node-header"
        onMouseDown={(e) => handleNodeMouseDown(e, node)}
      >
        <div className="flex items-center gap-2 flex-1">
          <Move size={14} className="text-gray-500 flex-shrink-0" />
          
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="font-medium text-sm w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="font-medium text-sm truncate flex-1" 
              onClick={handleTitleClick}
              title="Click to edit title"
            >
              {node.title}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleDuplicateNode}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Duplicate node"
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={() => deleteNode(node.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete node"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Node Content */}
      <div className="p-3">
        <textarea
          className={`w-full text-sm p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            node.type === 'prompt' ? 'h-24' : 'h-16'
          }`}
          value={node.content}
          onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
          placeholder={`Enter ${node.type} details...`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Node Type Label */}
      <div className="px-3 pb-2 text-xs text-neutral-500 italic">
        {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
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
        title="Connect to this input"
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
        title="Drag to connect to another node"
      >
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default WorkflowNode;