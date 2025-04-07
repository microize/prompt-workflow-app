import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppContext } from '../context/AppContext';
import { WorkflowContextProvider } from '../context/WorkflowContext';
import NodePalette from '../components/workflow/NodePalette';
import Canvas from '../components/workflow/Canvas';
import WorkflowControls from '../components/workflow/WorkflowControls';

const WorkflowPage = () => {
  const { workflows, selectedWorkflow, setSelectedWorkflow } = useAppContext();
  
  // Clear the selected workflow when unmounting
  useEffect(() => {
    return () => {
      setSelectedWorkflow(null);
    };
  }, [setSelectedWorkflow]);

  // Add this style tag to fix css issues
  useEffect(() => {
    // Add additional styles for the workflow page
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Fix for connection handles */
      .connection-handle {
        transition: all 0.2s ease-out;
        z-index: 30 !important;
      }
      
      .handle-highlight {
        transform: translate(-50%, -50%) scale(1.2) !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3) !important;
      }
      
      /* Output handle transforms differently */
      [data-handle-type="output"].handle-highlight {
        transform: translate(50%, -50%) scale(1.2) !important;
      }
      
      /* Connection drawing mode */
      .connection-drawing-mode {
        cursor: crosshair !important;
      }
      
      .connection-drawing-mode .input-handle {
        transform: translate(-50%, -50%) scale(1.2);
        animation: pulse 1.5s infinite ease-in-out;
      }
      
      /* Better connection path styling */
      .active-connection {
        stroke-dasharray: 5, 5;
        animation: dash 1s linear infinite;
      }
      
      @keyframes dash {
        to {
          stroke-dashoffset: -20;
        }
      }
      
      /* Make canvas truly "infinite" */
      .bg-grid-pattern {
        background-image: linear-gradient(to right, #e8eaed 1px, transparent 1px), 
                          linear-gradient(to bottom, #e8eaed 1px, transparent 1px);
        background-size: 20px 20px !important;
        min-width: 8000px !important;
        min-height: 8000px !important;
      }
      
      /* Fix for Safari overflow issues */
      .infinite-canvas {
        transform-origin: center center;
      }
      
      /* Fix for node dragging */
      .node-header {
        cursor: move !important;
      }
      
      /* Improved visibility during drag */
      .canvas-drag-mode {
        cursor: grabbing !important;
      }
      
      /* Connection success animation */
      .connection-success {
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.6) !important;
        animation: success-pulse 0.5s ease-out !important;
      }
      
      @keyframes success-pulse {
        0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { transform: translate(-50%, -50%) scale(1.5); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2);
        }
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    // Add DndProvider here to ensure it's properly scoped to the Workflow page
    <DndProvider backend={HTML5Backend}>
      <WorkflowContextProvider>
        <div className="flex h-full flex-col">
          <div className="flex flex-1 overflow-hidden">
            {/* Node Palette */}
            <NodePalette workflows={workflows} />
            
            {/* Canvas with improved wrapper */}
            <div className="flex-1 relative overflow-hidden canvas-container">
              <Canvas />
            </div>
          </div>
          
          {/* Footer Controls */}
          <WorkflowControls />
        </div>
      </WorkflowContextProvider>
    </DndProvider>
  );
};

export default WorkflowPage;