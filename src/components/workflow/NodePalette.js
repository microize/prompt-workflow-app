import React, { useState } from 'react';
import { Sparkles, ArrowRight, GitBranch, Search, X, BookOpen, Play, ChevronDown, ChevronRight } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { useWorkflowContext } from '../../context/WorkflowContext';
import Badge from '../common/Badge';

// Create a draggable component for workflow nodes
const DraggableNodeItem = ({ nodeType, icon, title, description }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WORKFLOW_NODE',
    item: { nodeType },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  // Determine color classes based on node type
  const getColorClasses = () => {
    switch (nodeType) {
      case 'prompt':
        return 'bg-blue-50 border-blue-100';
      case 'action':
        return 'bg-purple-50 border-purple-100';
      case 'condition':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-neutral-50 border-neutral-100';
    }
  };

  return (
    <div
      ref={drag}
      className={`${getColorClasses()} border p-3 rounded-lg cursor-move flex items-center gap-2 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-primary-200'
      } transition-all duration-200`}
    >
      {icon}
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
};

const NodePalette = ({ workflows = [] }) => {
  const { addNewNode, canvasRef } = useWorkflowContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateDetails, setShowTemplateDetails] = useState(null);
  // State for collapsible sections
  const [componentsCollapsed, setComponentsCollapsed] = useState(false);
  const [templatesCollapsed, setTemplatesCollapsed] = useState(false);

  // Filter workflows based on search term
  const filteredWorkflows = workflows?.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  // Handle double-click on component - add a new node in the center of the viewport
  const handleDoubleClick = (nodeType) => {
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 100; // Half of node width
    const centerY = canvasRect.height / 2 - 60; // Half of node height

    addNewNode(nodeType, {
      x: centerX + canvasRef.current.scrollLeft,
      y: centerY + canvasRef.current.scrollTop
    });
  };

  return (
    <div className="w-64 border-r border-neutral-200 flex flex-col h-full bg-white">
      {/* Components Section */}
      <div className="border-b border-neutral-200">
        <button 
          onClick={() => setComponentsCollapsed(!componentsCollapsed)}
          className="w-full p-3 flex justify-between items-center hover:bg-neutral-50"
        >
          <h3 className="font-medium text-neutral-700">Components</h3>
          {componentsCollapsed ? 
            <ChevronRight size={16} className="text-neutral-400" /> : 
            <ChevronDown size={16} className="text-neutral-400" />
          }
        </button>
        
        {/* Components content */}
        <div className={`transition-all duration-300 overflow-hidden ${componentsCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
          <div className="p-3 space-y-2">
            <div onDoubleClick={() => handleDoubleClick('prompt')} className="node-draggable">
              <DraggableNodeItem 
                nodeType="prompt"
                icon={<Sparkles size={16} className="text-primary-500 flex-shrink-0" />}
                title="Prompt Node"
                description="AI prompt template"
              />
            </div>
            
            <div onDoubleClick={() => handleDoubleClick('action')} className="node-draggable">
              <DraggableNodeItem 
                nodeType="action"
                icon={<ArrowRight size={16} className="text-purple-500 flex-shrink-0" />}
                title="Action Node"
                description="Process or transform"
              />
            </div>
            
            <div onDoubleClick={() => handleDoubleClick('condition')} className="node-draggable">
              <DraggableNodeItem 
                nodeType="condition"
                icon={<GitBranch size={16} className="text-secondary-500 flex-shrink-0" />}
                title="Condition Node"
                description="Branch your workflow"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Templates Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <button 
          onClick={() => setTemplatesCollapsed(!templatesCollapsed)}
          className="w-full p-3 flex justify-between items-center hover:bg-neutral-50 border-b border-neutral-200"
        >
          <h3 className="font-medium text-neutral-700">Templates</h3>
          {templatesCollapsed ? 
            <ChevronRight size={16} className="text-neutral-400" /> : 
            <ChevronDown size={16} className="text-neutral-400" />
          }
        </button>
        
        {/* Templates content */}
        <div className={`transition-all duration-300 overflow-hidden flex flex-col ${templatesCollapsed ? 'max-h-0 opacity-0' : 'flex-1 opacity-100'}`}>
          <div className="p-3 flex flex-col flex-1">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2 py-1 text-xs border border-neutral-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
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
        </div>
      </div>

      {/* Template Details Modal */}
      {showTemplateDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{showTemplateDetails.name}</h3>
              <button 
                onClick={() => setShowTemplateDetails(null)} 
                className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
              >
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
      
      {/* Add CSS for drag preview and improved drag/drop experience */}
      <style jsx global>{`
        /* Drag preview styling */
        .drag-preview {
          position: fixed;
          pointer-events: none;
          z-index: 1000;
          width: 10px;
          height: 10px;
          background: transparent;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
        
        .drag-preview.prompt {
          box-shadow: 0 0 0 8px rgba(66, 133, 244, 0.3);
        }
        
        .drag-preview.action {
          box-shadow: 0 0 0 8px rgba(161, 66, 244, 0.3);
        }
        
        .drag-preview.condition {
          box-shadow: 0 0 0 8px rgba(251, 188, 4, 0.3);
        }
        
        /* Highlight draggable areas */
        .node-draggable {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default NodePalette;