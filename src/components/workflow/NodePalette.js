import React from 'react';
import { Sparkles, ArrowRight, GitBranch } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';
import Badge from '../common/Badge';

const NodePalette = ({ workflows }) => {
  const { addNewNode, canvasRef } = useWorkflowContext();

  // Enhanced drag handling
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a ghost image
    const ghostEl = document.createElement('div');
    ghostEl.classList.add('bg-white', 'border', 'rounded-lg', 'p-3', 'shadow-lg');
    ghostEl.style.width = '150px';
    ghostEl.style.height = '80px';
    ghostEl.style.zIndex = '1000';
    ghostEl.style.position = 'absolute';
    ghostEl.style.top = '-1000px';
    ghostEl.innerText = nodeType === 'prompt' ? 'Prompt Node' : 
                        nodeType === 'action' ? 'Action Node' : 'Condition Node';
    
    document.body.appendChild(ghostEl);
    e.dataTransfer.setDragImage(ghostEl, 75, 40);
    
    setTimeout(() => {
      document.body.removeChild(ghostEl);
    }, 0);
  };

  // Handle the drop on canvas
  const handleCanvasDrop = (e) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    
    const nodeType = e.dataTransfer.getData('nodeType');
    if (!nodeType) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - canvasRect.left;
    const dropY = e.clientY - canvasRect.top;
    
    // Add the node at the drop position
    addNodeAtPosition(nodeType, dropX, dropY);
  };
  
  // Function to add node at specific position
  const addNodeAtPosition = (type, x, y) => {
    if (!canvasRef.current) return;
    
    const newNode = {
      id: Date.now(),
      type: type,
      title: type === 'prompt' ? 'New Prompt' : 
             type === 'action' ? 'New Action' : 'New Condition',
      position: {
        x: Math.max(0, x - 100), // Center the node at drop point
        y: Math.max(0, y - 30)
      },
      content: type === 'prompt' ? 'Enter your prompt here...' : 
               type === 'action' ? 'Action configuration' : 'Condition settings'
    };
    
    // Add to nodes
    addNewNode(type, newNode.position);
  };

  // Handle double-click on component
  const handleDoubleClick = (nodeType) => {
    addNewNode(nodeType);
  };

  // Set up event listeners for canvas drop zone
  React.useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };
    
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleCanvasDrop);
    
    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleCanvasDrop);
    };
  }, [canvasRef]);

  return (
    <div className="w-64 border-r border-neutral-200 flex flex-col h-full">
      {/* Components Section */}
      <div className="p-3 border-b border-neutral-200">
        <h3 className="font-medium text-neutral-700 mb-3">Components</h3>
        
        <div className="space-y-2">
          <div 
            className="bg-blue-50 border border-blue-100 p-3 rounded-lg cursor-move flex items-center gap-2 hover:shadow-md transition-shadow"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'prompt')}
            onDoubleClick={() => handleDoubleClick('prompt')}
            title="Drag to canvas or double-click to add"
          >
            <Sparkles size={16} className="text-primary-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Prompt Node</p>
              <p className="text-xs text-neutral-500">AI prompt template</p>
            </div>
          </div>
          
          <div 
            className="bg-purple-50 border border-purple-100 p-3 rounded-lg cursor-move flex items-center gap-2 hover:shadow-md transition-shadow"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'action')}
            onDoubleClick={() => handleDoubleClick('action')}
            title="Drag to canvas or double-click to add"
          >
            <ArrowRight size={16} className="text-purple-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Action Node</p>
              <p className="text-xs text-neutral-500">Process or transform</p>
            </div>
          </div>
          
          <div 
            className="bg-amber-50 border border-amber-100 p-3 rounded-lg cursor-move flex items-center gap-2 hover:shadow-md transition-shadow"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'condition')}
            onDoubleClick={() => handleDoubleClick('condition')}
            title="Drag to canvas or double-click to add"
          >
            <GitBranch size={16} className="text-secondary-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Condition Node</p>
              <p className="text-xs text-neutral-500">Branch your workflow</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Templates Section - with scrollable area */}
      <div className="p-3 flex-1 overflow-hidden flex flex-col">
        <h3 className="font-medium text-neutral-700 mb-3">Templates</h3>
        
        <div className="space-y-2 overflow-y-auto hide-scrollbar flex-1 pr-1">
          {workflows.map(workflow => (
            <div key={workflow.id} className="border border-neutral-200 p-3 rounded-lg hover:bg-neutral-50 transition-all hover:shadow-sm cursor-pointer">
              <p className="font-medium text-sm line-clamp-1">{workflow.name}</p>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{workflow.description}</p>
              <div className="flex justify-between items-center mt-2">
                <Badge variant={workflow.category} size="sm">
                  {workflow.category}
                </Badge>
                <span className="text-xs text-neutral-500">{workflow.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodePalette;