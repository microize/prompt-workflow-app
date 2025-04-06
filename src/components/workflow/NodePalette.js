import React, { useState } from 'react';
import { Sparkles, ArrowRight, GitBranch, Search, X, BookOpen, Play } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';
import Badge from '../common/Badge';

const NodePalette = ({ workflows }) => {
  const { addNewNode, canvasRef } = useWorkflowContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateDetails, setShowTemplateDetails] = useState(null);

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

  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show template details
  const handleShowTemplateDetails = (workflow) => {
    setShowTemplateDetails(workflow);
  };

  // Handle template application
  const handleApplyTemplate = (workflow) => {
    if (window.confirm(`Apply the "${workflow.name}" template? This will clear your current canvas.`)) {
      // In a real app, you would implement the template application here
      alert('Template applied successfully!');
      setShowTemplateDetails(null);
    }
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
    <div className="w-64 border-r border-neutral-200 flex flex-col h-full bg-white">
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
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-neutral-700">Templates</h3>
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2 py-1 text-xs border border-neutral-200 rounded-md w-32 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div className="space-y-2 overflow-y-auto hide-scrollbar flex-1 pr-1">
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map(workflow => (
              <div 
                key={workflow.id} 
                className="border border-neutral-200 p-3 rounded-lg hover:bg-neutral-50 transition-all hover:shadow-sm cursor-pointer"
                onClick={() => handleShowTemplateDetails(workflow)}
              >
                <p className="font-medium text-sm line-clamp-1">{workflow.name}</p>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{workflow.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant={workflow.category} size="sm">
                    {workflow.category}
                  </Badge>
                  <span className="text-xs text-neutral-500">{workflow.lastUsed}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500 text-sm">No templates found</p>
              {searchTerm && (
                <button 
                  className="text-primary-500 text-xs mt-2"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Template Details Modal */}
      {showTemplateDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{showTemplateDetails.name}</h3>
              <button onClick={() => setShowTemplateDetails(null)} className="text-neutral-500 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>
            
            <Badge variant={showTemplateDetails.category} size="md" className="mb-4">
              {showTemplateDetails.category}
            </Badge>
            
            <p className="text-neutral-600 mb-4">{showTemplateDetails.description}</p>
            
            <div className="border-t border-b border-neutral-200 py-4 my-4">
              <h4 className="font-medium mb-2">Workflow Steps</h4>
              <ol className="list-decimal pl-5 space-y-2">
                {showTemplateDetails.steps.map((step, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{step.name}</span>
                    <p className="text-xs text-neutral-500 mt-1">{step.prompt}</p>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTemplateDetails(null)}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyTemplate(showTemplateDetails)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm flex items-center gap-1"
              >
                <Play size={16} />
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodePalette;