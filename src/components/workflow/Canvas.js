import React, { useEffect } from 'react';
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
    potentialTarget,
    canvasRef,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    addNewNode,
    deleteConnection
  } = useWorkflowContext();

  // Add event listeners for the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      handleCanvasMouseMove(e);
    };

    const handleMouseUp = (e) => {
      handleCanvasMouseUp(e);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, handleCanvasMouseMove, handleCanvasMouseUp]);

  return (
    <div className="flex-1 relative overflow-hidden bg-neutral-50">
      <div 
        ref={canvasRef}
        className="w-full h-full relative" 
      >
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern"></div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none z-0">
          {/* Existing Connections */}
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            
            if (!sourceNode || !targetNode) return null;
            
            // Calculate the position of the connection points
            const sourceX = sourceNode.position.x + 200; // Right side of source node
            const sourceY = sourceNode.position.y + 60;  // Middle of node
            const targetX = targetNode.position.x;       // Left side of target node
            const targetY = targetNode.position.y + 60;  // Middle of node
            
            // Calculate the Bezier curve control points
            const dx = Math.abs(targetX - sourceX);
            const controlX1 = sourceX + dx * 0.25;
            const controlY1 = sourceY;
            const controlX2 = targetX - dx * 0.25;
            const controlY2 = targetY;
            
            const pathD = `M${sourceX},${sourceY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;
            
            return (
              <g key={connection.id}>
                {/* Main visible connection line */}
                <path
                  d={pathD}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  fill="none"
                  className="connection-path pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this connection?')) {
                      deleteConnection(connection.id);
                    }
                  }}
                />
                
                {/* Invisible wider path for easier clicking/hovering */}
                <path
                  d={pathD}
                  stroke="transparent"
                  strokeWidth="12"
                  fill="none"
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this connection?')) {
                      deleteConnection(connection.id);
                    }
                  }}
                />
              </g>
            );
          })}
          
          {/* Active Connection Being Drawn */}
          {isDrawingConnection && connectionStart && connectionEnd && (
            <>
              <path
                d={`M${connectionStart.x},${connectionStart.y} C${connectionStart.x + 50},${connectionStart.y} ${connectionEnd.x - 50},${connectionEnd.y} ${connectionEnd.x},${connectionEnd.y}`}
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                className="connection-path-dashed"
              />
              
              {/* Show a highlight for potential target */}
              {potentialTarget && (
                <circle
                  cx={potentialTarget.x}
                  cy={potentialTarget.y}
                  r="8"
                  fill="#3b82f6"
                  className="animate-pulse"
                />
              )}
            </>
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
              <div className="flex flex-col items-center">
                <GitBranch size={48} className="text-neutral-300 mb-4" />
                <h3 className="text-xl font-medium text-neutral-500 mb-2">Start Building Your Workflow</h3>
                <p className="text-neutral-400 mb-4">Drag components from the left panel onto this canvas</p>
                <button 
                  onClick={() => addNewNode('prompt')}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                  <Plus size={16} />
                  Add First Node
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;