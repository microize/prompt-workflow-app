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