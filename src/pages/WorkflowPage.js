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

  return (
    <WorkflowContextProvider>
      <div className="flex h-full flex-col">
        <div className="p-4 bg-white border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Build Your Workflow</h2>
              <p className="text-sm text-neutral-500">
                Drag components from the left panel onto the canvas or right-click to add nodes. Connect nodes by dragging from the output handle (right) to the input handle (left) of another node.
              </p>
            </div>
            
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-sm"
                onChange={handleTemplateChange}
                value={selectedWorkflow ? selectedWorkflow.id : ''}
              >
                <option value="">-- Select Template --</option>
                {workflows.map(workflow => (
                  <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Node Palette */}
          <NodePalette workflows={workflows} />
          
          {/* Canvas */}
          <Canvas />
        </div>
        
        {/* Footer Controls */}
        <WorkflowControls />
      </div>
    </WorkflowContextProvider>
  );
};

export default WorkflowPage;