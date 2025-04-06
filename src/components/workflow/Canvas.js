import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
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
  // Track fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Set up React DnD drop target with better handling
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'WORKFLOW_NODE',
    drop: (item, monitor) => {
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const dropOffset = monitor.getClientOffset();
      
      // If there's no offset, exit early
      if (!dropOffset) return { moved: false };
      
      // Calculate position considering scroll, zoom, and pan
      const x = (dropOffset.x - canvasRect.left + canvasRef.current.scrollLeft) / zoomLevelRef.current - panOffsetRef.current.x;
      const y = (dropOffset.y - canvasRect.top + canvasRef.current.scrollTop) / zoomLevelRef.current - panOffsetRef.current.y;
      
      // Add node at the drop position
      const nodeType = item.nodeType || item.type;
      addNewNode(nodeType, { x, y });
      return { moved: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }), [addNewNode, zoomLevelRef, panOffsetRef]);

  // Add event listeners for the canvas with throttled mouse move
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Define a throttled mousemove handler to improve performance
    let lastMoveTime = 0;
    const throttleMs = 16; // ~60fps
    
    const throttledMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveTime >= throttleMs) {
        handleCanvasMouseMove(e);
        lastMoveTime = now;
      }
    };

    canvas.addEventListener('mousemove', throttledMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', throttledMouseMove);
      canvas.removeEventListener('mouseup', handleCanvasMouseUp);
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
  const handleZoom = useCallback((zoomIn) => {
    if (canvasContainerRef.current) {
      // Calculate new zoom level with limits
      const newZoom = zoomIn 
        ? Math.min(zoomLevelRef.current + 0.1, 2) // Max zoom: 2x
        : Math.max(zoomLevelRef.current - 0.1, 0.5); // Min zoom: 0.5x
      
      zoomLevelRef.current = newZoom;
      
      // Apply transform with both zoom and pan
      applyTransform(newZoom, panOffsetRef.current);
    }
  }, []);
  
  // Helper function to apply transform
  const applyTransform = (zoom, pan) => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.style.transform = `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`;
    }
  };

  // Function to reset zoom and pan
  const resetZoomAndPan = useCallback(() => {
    if (canvasContainerRef.current) {
      zoomLevelRef.current = 1;
      panOffsetRef.current = { x: 0, y: 0 };
      applyTransform(1, { x: 0, y: 0 });
    }
  }, []);
  
  // Handle canvas panning - use middle mouse button or Ctrl+drag
  const handleCanvasMouseDown = useCallback((e) => {
    // Only initiate panning with middle mouse button (button 1) or Ctrl+left click
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      
      // Change cursor during panning
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  }, []);
  
  // Effect for handling pan move and end
  useEffect(() => {
    if (!isPanning) return;
    
    const handlePanMove = (e) => {
      if (!isPanning || !canvasContainerRef.current) return;
      
      const dx = (e.clientX - panStart.x) / zoomLevelRef.current;
      const dy = (e.clientY - panStart.y) / zoomLevelRef.current;
      
      const newPanOffset = {
        x: panOffsetRef.current.x + dx,
        y: panOffsetRef.current.y + dy
      };
      
      panOffsetRef.current = newPanOffset;
      applyTransform(zoomLevelRef.current, newPanOffset);
      setPanStart({ x: e.clientX, y: e.clientY });
    };
    
    const handlePanEnd = () => {
      setIsPanning(false);
      
      // Reset cursor
      if (canvasRef.current) {
        canvasRef.current.style.cursor = '';
      }
    };
    
    // Add event listeners for panning
    document.addEventListener('mousemove', handlePanMove);
    document.addEventListener('mouseup', handlePanEnd);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    };
  }, [isPanning, panStart]);
  
  // Handle mousewheel for zooming - throttled for better performance
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      
      // Simple throttle
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
  }, [handleZoom]);

  // Add useEffect for wheel event (using passive: false)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Use the non-passive listener to be able to preventDefault
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Handle right-click to add node at position
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    
    // Get canvas coordinates, accounting for scroll, zoom, and pan
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left + canvasRef.current.scrollLeft) / zoomLevelRef.current - panOffsetRef.current.x;
    const y = (e.clientY - rect.top + canvasRef.current.scrollTop) / zoomLevelRef.current - panOffsetRef.current.y;
    
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
  }, [addNewNode]);

  // FULLSCREEN FUNCTIONALITY - ENHANCED AND FIXED
  const handleFullscreen = useCallback(() => {
    if (!canvasRef.current) return;
    
    const element = canvasRef.current.parentElement; // Use the parent div instead of just the canvas
    
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
      // If not in fullscreen mode, enter fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
        setIsFullscreen(true);
      } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        setIsFullscreen(true);
      } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      // If already in fullscreen mode, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
        setIsFullscreen(false);
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
        setIsFullscreen(false);
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [canvasRef]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = 
        !!document.fullscreenElement || 
        !!document.mozFullScreenElement || 
        !!document.webkitFullscreenElement || 
        !!document.msFullscreenElement;
      
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Add class to the canvas container for specific fullscreen styling if needed
      if (canvasRef.current && canvasRef.current.parentElement) {
        if (isCurrentlyFullscreen) {
          canvasRef.current.parentElement.classList.add('canvas-fullscreen');
        } else {
          canvasRef.current.parentElement.classList.remove('canvas-fullscreen');
        }
      }
    };
    
    // Add event listeners for all browser variants
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [canvasRef]);

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
          onClick={handleFullscreen}
          className="p-1 hover:bg-gray-100 rounded-md"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <Maximize size={18} />
        </button>
      </div>
      
      <div 
        ref={(node) => {
          // Combine React's ref with React DnD's drop ref
          if (node) {
            canvasRef.current = node;
            drop(node);
          }
        }}
        className={`w-full h-full overflow-auto relative ${
          isOver && canDrop ? 'bg-blue-50 bg-opacity-30' : ''
        } ${isFullscreen ? 'fullscreen-enabled' : ''}`}
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
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
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
            
            {/* Active Connection Being Drawn - Enhanced for immediate visual feedback */}
            {isDrawingConnection && connectionStart && (
              <>
                {/* Draw the connection line in real-time */}
                <path
                  d={`M${connectionStart.x},${connectionStart.y} C${connectionStart.x + 50},${connectionStart.y} ${connectionEnd.x - 50},${connectionEnd.y} ${connectionEnd.x},${connectionEnd.y}`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="active-connection"
                />
                
                {/* Starting point indicator */}
                <circle
                  cx={connectionStart.x}
                  cy={connectionStart.y}
                  r="5"
                  fill="#3b82f6"
                />
                
                {/* End point follows mouse cursor */}
                <circle
                  cx={connectionEnd.x}
                  cy={connectionEnd.y}
                  r="5"
                  fill="#3b82f6"
                  className="cursor-connection-point"
                />
                
                {/* Enhanced feedback when near a potential target */}
                {potentialTarget && (
                  <>
                    <circle
                      cx={potentialTarget.x}
                      cy={potentialTarget.y}
                      r="8"
                      fill="#3b82f6"
                      className="animate-pulse"
                    />
                    <circle
                      cx={potentialTarget.x}
                      cy={potentialTarget.y}
                      r="12"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                    
                    {/* Draw a connecting line to the potential target */}
                    <path
                      d={`M${connectionEnd.x},${connectionEnd.y} L${potentialTarget.x},${potentialTarget.y}`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                      opacity="0.7"
                    />
                  </>
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
        <p>Drag from left panel: Add node</p>
      </div>
    </div>
  );
};

export default Canvas;