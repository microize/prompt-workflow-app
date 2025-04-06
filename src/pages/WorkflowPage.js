// src/pages/WorkflowPage.js

import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { WorkflowContextProvider } from '../context/WorkflowContext';
import NodePalette from '../components/workflow/NodePalette';
import Canvas from '../components/workflow/Canvas';
import WorkflowControls from '../components/workflow/WorkflowControls';

const WorkflowPage = () => {
  const { workflows, selectedWorkflow, setSelectedWorkflow } = useAppContext();
  
  // Handle template selection
  const handleTemplateChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const workflow = workflows.find(w => w.id === parseInt(selectedId));
      setSelectedWorkflow(workflow);
    } else {
      setSelectedWorkflow(null);
    }
  };

  // Clear the selected workflow when unmounting
  useEffect(() => {
    return () => {
      setSelectedWorkflow(null);
    };
  }, [setSelectedWorkflow]);

  // Add this style tag to fix css issues (temporary solution until we can update global.css)
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
        min-width: 8000px !important;
        min-height: 8000px !important;
        background-size: 20px 20px !important;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
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
  );
};

export default WorkflowPage;