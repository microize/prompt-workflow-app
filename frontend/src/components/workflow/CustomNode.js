// src/components/workflow/CustomNode.js
// Update the Handle implementation

import React, { useState, useRef, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Move, X, Copy, Edit, Check } from 'lucide-react';

const CustomNode = ({ id, data, isConnectable, selected }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(data.title);
  const [contentValue, setContentValue] = useState(data.content);
  
  const titleInputRef = useRef(null);
  const { setNodes } = useReactFlow();

  // Get node type style classes
  const getNodeColorClass = () => {
    switch (data.type) {
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
    switch (data.type) {
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

  // Handle title interaction
  const handleTitleClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 10);
  };

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() !== '') {
      data.onTitleChange(id, titleValue);
    } else {
      setTitleValue(data.title);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitleValue(data.title);
      setIsEditingTitle(false);
    }
  };

  // Handle content interaction with debouncing
  const handleContentChange = (e) => {
    setContentValue(e.target.value);
  };

  const handleContentBlur = useCallback(() => {
    data.onContentChange(id, contentValue);
  }, [data, id, contentValue]);

  // Handle node actions
  const handleDuplicateNode = (e) => {
    e.stopPropagation();
    data.onDuplicate(id);
  };

  const handleDeleteNode = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div 
      className={`shadow-md border ${getNodeColorClass()} ${
        selected ? 'ring-2 ring-primary-500' : ''
      } rounded-lg w-[220px]`}
    >
      {/* Input handle - target for connections */}
      <Handle
        type="target"
        position={Position.Left}
        className={`w-4 h-4 rounded-full border-2 border-white bg-gray-400 cursor-crosshair -left-[8px] top-1/2 react-flow__handle-left`}
        isConnectable={isConnectable}
        id="target"
        style={{ zIndex: 20 }}
      />
      
      {/* Node Header */}
      <div 
        className="p-3 border-b border-gray-200 cursor-move flex justify-between items-center node-header"
      >
        <div className="flex items-center gap-2 flex-1">
          <Move size={14} className="text-gray-500 flex-shrink-0" />
          
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleValue}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="font-medium text-sm w-full bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="font-medium text-sm truncate flex-1 cursor-text" 
              onClick={handleTitleClick}
              title="Click to edit title"
            >
              {data.title}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleDuplicateNode}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-white"
            title="Duplicate node"
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={handleDeleteNode}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white"
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
            data.type === 'prompt' ? 'h-24' : 'h-16'
          }`}
          value={contentValue}
          onChange={handleContentChange}
          onBlur={handleContentBlur}
          placeholder={`Enter ${data.type} details...`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Node Type Label */}
      <div className="px-3 pb-2 text-xs text-neutral-500 italic">
        {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Node
      </div>
      
      {/* Output handle - source for connections */}
      <Handle
        type="source"
        position={Position.Right}
        className={`w-4 h-4 rounded-full border-2 border-white cursor-crosshair -right-[8px] top-1/2 react-flow__handle-right ${getHandleColorClass()}`}
        isConnectable={isConnectable}
        id="source"
        style={{ zIndex: 20 }}
      />
    </div>
  );
};

export default CustomNode;