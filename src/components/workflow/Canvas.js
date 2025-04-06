import React, { useEffect, useRef, useState } from 'react';
import { GitBranch, Plus, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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
    deleteConnection,
    lastCreatedNodeId
  } = useWorkflowContext();

  // Ref for tracking the current zoom level
  const zoomLevelRef = useRef(1);
  // Ref for tracking pan offset
  const panOffsetRef = useRef({ x: 0, y: 0 });
  // Ref for the canvas container to apply transforms
  const canvasContainerRef = useRef(null);
  
  // Pan state for drag-to-pan functionality
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Add event listeners for the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Define a throttled mousemove handler to improve performance
    let lastMoveTime = 0;
    const throttledMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveTime >= 16) { // ~60fps
        handleCanvasMouseMove(e);
        lastMoveTime = now;
      }
    };

    const handleMouseUp = (e) => {
      handleCanvasMouseUp(e);
    };

    canvas.addEventListener('mousemove', throttledMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', throttledMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, handleCanvasMouseMove, handleCanvasMouseUp]);

  // Scroll to newly created node
  useEffect(() => {
    if (lastCreatedNodeId && nodes.length > 0) {
      const newNode = nodes.find(n => n.id === lastCreatedNodeId);
      if (newNode && canvasRef.current) {
        // Use a small delay to ensure the node is rendered
        setTimeout(() => {
          canvasRef.current.scrollTo({
            left: Math.max(0, newNode.position.x - 100),
            top: Math.max(0, newNode.position.y - 100),
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [lastCreatedNodeId, nodes]);

  // Function to handle zooming
  const handleZoom = (zoomIn) => {
    if (canvasContainerRef.current) {
      const newZoom = zoomIn 
        ? Math.min(zoomLevelRef.current + 0.1, 2) // Max zoom: 2x
        : Math.max(zoomLevelRef.current - 0.1, 0.5); // Min zoom: 0.5x
      
      zoomLevelRef.current = newZoom;
      canvasContainerRef.current.style.transform = `scale(${newZoom}) translate(${panOffsetRef.current.x}px, ${panOffsetRef.current.y}px)`;
    }
  };

  // Function to reset zoom and pan
  const resetZoomAndPan = () => {
    if (canvasContainerRef.current) {
      zoomLevelRef.current = 1;
      panOffsetRef.current = { x: 0, y: 0 };
      canvasContainerRef.current.style.transform = 'scale(1) translate(0px, 0px)';
    }
  };
  
  // Handle canvas panning - use middle mouse button or Ctrl+drag
  const handleCanvasMouseDown = (e) => {
    // Only initiate panning with middle mouse button (button 1) or Ctrl+left click
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      
      // Add event listeners for panning
      document.addEventListener('mousemove', handlePanMove);
      document.addEventListener('mouseup', handlePanEnd);
      
      // Change cursor during panning
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  };
  
  const handlePanMove = (e) => {
    if (isPanning && canvasContainerRef.current) {
      const dx = (e.clientX - panStart.x) / zoomLevelRef.current;
      const dy = (e.clientY - panStart.y) / zoomLevelRef.current;
      
      panOffsetRef.current = {
        x: panOffsetRef.current.x + dx,
        y: panOffsetRef.current.y + dy
      };
      
      canvasContainerRef.current.style.transform = `scale(${zoomLevelRef.current}) translate(${panOffsetRef.current.x}px, ${panOffsetRef.current.y}px)`;
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handlePanEnd = () => {
    setIsPanning(false);
    document.removeEventListener('mousemove', handlePanMove);
    document.removeEventListener('mouseup', handlePanEnd);
    
    // Reset cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = '';
    }
  };
  
  // Handle mousewheel for zooming - throttled for better performance
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      
      // Throttle wheel events
      if (!e.target.dataset.wheelThrottle) {
        e.target.dataset.wheelThrottle = true;
        
        const zoomIn = e.deltaY < 0;
        handleZoom(zoomIn);
        
        // Reset throttle after a short delay
        setTimeout(() => {
          e.target.dataset.wheelThrottle = false;
        }, 50);
      }
    }
  };

  // Handle right-click to add node at position
  const handleContextMenu = (e) => {
    e.preventDefault();
    
    // Get canvas coordinates, accounting for scroll and zoom
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left + canvasRef.current.scrollLeft) / zoomLevelRef.current;
    const y = (e.clientY - rect.top + canvasRef.current.scrollTop) / zoomLevelRef.current;
    
    // Create context menu with improved styling and simplified options
    const menu = document.createElement('div');
    menu.className = 'absolute bg-white shadow-md rounded-md z-50 overflow-hidden';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    
    // Add menu options with clear visual design
    const options = [
      { label: 'Add Prompt Node', type: 'prompt', color: 'bg-blue-50 hover:bg-blue-100' },
      { label: 'Add Action Node', type: 'action', color: 'bg-purple-50 hover:bg-purple-100' },
      { label: 'Add Condition Node', type: 'condition', color: 'bg-amber-50 hover:bg-amber-100' }
    ];
    
    options.forEach(option => {
      const button = document.createElement('button');
      button.className = `block w-full text-left px-4 py-2 ${option.color} text-sm transition-colors`;
      button.innerText = option.label;
      button.onclick = () => {
        addNewNode(option.type, { x, y });
        document.body.removeChild(menu);
      };
      menu.appendChild(button);
    });
    
    document.body.appendChild(menu);
    
    // Handle click outside to close menu
    const handleOutsideClick = (evt) => {
      if (!menu.contains(evt.target)) {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
        document.removeEventListener('click', handleOutsideClick);
      }
    };
    
    // Delay adding the listener to prevent immediate closure
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  };

  // Add useEffect for wheel event (using passive: false)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleWheelEvent = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomIn = e.deltaY < 0;
        handleZoom(zoomIn);
      }
    };
    
    // Use the non-passive listener to be able to preventDefault
    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden bg-neutral-50">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-md p-2 flex flex-col space-y-2">
        <button 
          onClick={() => handleZoom(true)}
          className="p-1 hover:bg-gray-100 rounded-md" 
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          onClick={() => handleZoom(false)}
          className="p-1 hover:bg-gray-100 rounded-md"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button 
          onClick={resetZoomAndPan}
          className="p-1 hover:bg-gray-100 rounded-md"
          title="Reset View"
        >
          <Maximize size={18} />
        </button>
      </div>
      
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-auto relative" 
        onContextMenu={handleContextMenu}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
      >
        {/* Transformable content container */}
        <div 
          ref={canvasContainerRef}
          className="min-w-full min-h-full origin-center relative transition-transform duration-100"
          style={{ width: '3000px', height: '3000px' }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 bg-grid-pattern"></div>
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
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
              
              // Get the color based on node type
              const getConnectionColor = () => {
                switch (sourceNode.type) {
                  case 'prompt': return '#4285f4';
                  case 'action': return '#a142f4';
                  case 'condition': return '#fbbc04';
                  default: return '#94a3b8';
                }
              };
              
              return (
                <g key={connection.id}>
                  {/* Main visible connection line */}
                  <path
                    d={pathD}
                    stroke={getConnectionColor()}
                    strokeWidth="2"
                    fill="none"
                    className="connection-path pointer-events-auto transition-all duration-300"
                  />
                  
                  {/* Arrow head */}
                  <circle
                    cx={targetX}
                    cy={targetY}
                    r="4"
                    fill={getConnectionColor()}
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
                      deleteConnection(connection.id);
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
        </div>
        
        {/* Empty State - Outside of the transformable container */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 bg-white bg-opacity-90 rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                <GitBranch size={48} className="text-neutral-300 mb-4" />
                <h3 className="text-xl font-medium text-neutral-500 mb-2">Start Building Your Workflow</h3>
                <p className="text-neutral-400 mb-4">Drag components from the left panel onto this canvas or right-click to add nodes</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => addNewNode('prompt')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus size={16} />
                    Add Prompt
                  </button>
                  <button 
                    onClick={() => addNewNode('action')}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus size={16} />
                    Add Action
                  </button>
                  <button 
                    onClick={() => addNewNode('condition')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus size={16} />
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Canvas navigation guide */}
      <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow-md p-2 text-xs text-neutral-500">
        <p>Right-click: Add node</p>
        <p>Ctrl+Drag: Pan canvas</p>
        <p>Ctrl+Wheel: Zoom</p>
      </div>
    </div>
  );
};

export default Canvas;