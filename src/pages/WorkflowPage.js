import React from 'react';
import { PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { WorkflowContextProvider, useWorkflowContext } from '../context/WorkflowContext';
import NodePalette from '../components/workflow/NodePalette';
import Canvas from '../components/workflow/Canvas';
import WorkflowControls from '../components/workflow/WorkflowControls';

const WorkflowPage = () => {
  const { workflows } = useAppContext();
  
  return (
    <WorkflowContextProvider>
      <div className="flex h-full flex-col">
        <div className="p-4 bg-white border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Build Your Workflow</h2>
              <p className="text-sm text-neutral-500">
                Drag components from the left panel onto this canvas. Connect nodes by dragging from the right handle to the left handle of another node.
              </p>
            </div>
            
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-sm">
                <option value="">-- Select Template --</option>
                {workflows.map(workflow => (
                  <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                ))}
              </select>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">
                Save Workflow
              </button>
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