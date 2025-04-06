import React from 'react';
import { PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { WorkflowContextProvider } from '../context/WorkflowContext';
import NodePalette from '../components/workflow/NodePalette';
import Canvas from '../components/workflow/Canvas';

const WorkflowPage = () => {
  const { workflows } = useAppContext();
  
  return (
    <WorkflowContextProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Workflow Editor</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Build Your Workflow</h2>
              <p className="text-sm text-gray-500">
                Drag and drop nodes to create custom workflows
              </p>
            </div>
            
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
                <option value="">-- Select Template --</option>
                {workflows.map(workflow => (
                  <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                ))}
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                Save Workflow
              </button>
            </div>
          </div>
          
          <div className="flex h-[calc(100vh-250px)]">
            {/* Node Palette */}
            <NodePalette workflows={workflows} />
            
            {/* Canvas */}
            <Canvas />
          </div>
          
          {/* Footer Controls */}
          <WorkflowControls />
        </div>
      </div>
    </WorkflowContextProvider>
  );
};

const WorkflowControls = () => {
  const { nodes, connections, clearCanvas } = useWorkflowContext();
  
  return (
    <div className="p-4 border-t flex justify-between items-center">
      <div className="text-sm text-gray-500">
        {nodes.length} nodes | {connections.length} connections
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={clearCanvas}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
        >
          Clear Canvas
        </button>
        
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1">
          <PlayCircle size={16} />
          Run Workflow
        </button>
      </div>
    </div>
  );
};

// Import at the top of the file
import { useWorkflowContext } from '../context/WorkflowContext';

export default WorkflowPage;