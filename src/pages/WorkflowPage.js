// src/pages/WorkflowPage.js
import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useAppContext } from '../context/AppContext';
import { WorkflowContextProvider } from '../context/WorkflowContext';
import NodePalette from '../components/workflow/NodePalette';
import Canvas from '../components/workflow/Canvas';
import WorkflowControls from '../components/workflow/WorkflowControls';

const WorkflowPage = () => {
  const { workflows, selectedWorkflow, setSelectedWorkflow } = useAppContext();
  
  // Clear the selected workflow when unmounting
  useEffect(() => {
    // Add performance monitoring for canvas operations
    const perfMonitor = {
      renderStart: 0,
      renderTimes: [],
    };
    
    const startRenderTimer = () => {
      perfMonitor.renderStart = performance.now();
    };
    
    const endRenderTimer = () => {
      if (perfMonitor.renderStart > 0) {
        const renderTime = performance.now() - perfMonitor.renderStart;
        perfMonitor.renderTimes.push(renderTime);
        
        // Log if render time is concerning (over 100ms)
        if (renderTime > 100) {
          console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
        }
        
        perfMonitor.renderStart = 0;
      }
    };
    
    // Add listeners for render performance monitoring
    window.addEventListener('reactflow.render.start', startRenderTimer);
    window.addEventListener('reactflow.render.end', endRenderTimer);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('reactflow.render.start', startRenderTimer);
      window.removeEventListener('reactflow.render.end', endRenderTimer);
      
      // Clear the selected workflow
      setSelectedWorkflow(null);
      
      // Log performance metrics
      if (perfMonitor.renderTimes.length > 0) {
        const avgRenderTime = perfMonitor.renderTimes.reduce((a, b) => a + b, 0) / perfMonitor.renderTimes.length;
        console.info(`Workflow canvas average render time: ${avgRenderTime.toFixed(2)}ms`);
      }
    };
  }, [setSelectedWorkflow]);

  return (
    <DndProvider backend={HTML5Backend}>
      <WorkflowContextProvider>
        <div className="flex h-full flex-col">
          <div className="flex flex-1 overflow-hidden">
            {/* Node Palette */}
            <NodePalette workflows={workflows} />
            
            {/* Canvas with improved performance */}
            <div className="flex-1 relative overflow-hidden canvas-container" id="workflow-canvas-container">
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