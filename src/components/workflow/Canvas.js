import React from 'react';
import { GitBranch, Plus } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';
import WorkflowNode from './WorkflowNode';

const Canvas = () => {
  const {
    nodes,
    connections,
    isDrawingConnection,
    connectionStart,
    connectionEnd,
    canvasRef,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    addNewNode
  } = useWorkflowContext();

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-50 p-4">
      <div 
        ref={canvasRef}
        className="w-full h-full relative" 
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const sourceX = sourceNode.position.x + 200;
            const sourceY = sourceNode.position.y + 60;
            const targetX = targetNode.position.x;
            const targetY = targetNode.position.y + 60;
            
            return (
              <path
                key={connection.id}
                d={`M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`}
                stroke="#94a3b8"
                strokeWidth="2"
                fill="none"
              />
            );
          })}
          
          {isDrawingConnection && connectionStart && (
            <path
              d={`M${connectionStart.position.x + 200},${connectionStart.position.y + 60} C${connectionStart.position.x + 250},${connectionStart.position.y + 60} ${connectionEnd.x - 50},${connectionEnd.y} ${connectionEnd.x},${connectionEnd.y}`}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          )}
        </svg>
        
        {/* Nodes */}
        {nodes.map(node => (
          <WorkflowNode 
            key={node.id} 
            node={node} 
          />
        ))}
        
        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <GitBranch size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">Start Building Your Workflow</h3>
              <p className="text-gray-400 mb-4">Drag components from the left panel onto this canvas</p>
              <button 
                onClick={() => addNewNode('prompt')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 mx-auto"
              >
                <Plus size={16} />
                Add First Node
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;