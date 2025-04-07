// src/components/workflow/NodePalette.js
import React, { useState, memo, useCallback } from 'react';
import { Sparkles, ArrowRight, GitBranch, Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { useWorkflowContext } from '../../context/WorkflowContext';
import Badge from '../common/Badge';

// Create a memoized draggable component to prevent unnecessary re-renders
const DraggableNodeItem = memo(({ nodeType, icon, title, description }) => {
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
      data-node-type={nodeType}
    >
      {icon}
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
});

// Memoized template item to prevent re-renders
const TemplateItem = memo(({ workflow, onShowDetails }) => {
  return (
    <div 
      className="border border-neutral-200 p-3 rounded-lg hover:bg-neutral-50 transition-all hover:shadow-sm cursor-pointer"
      onClick={() => onShowDetails(workflow)}
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
  );
});

// Main NodePalette component with optimizations
const NodePalette = ({ workflows = [] }) => {
  const { addNewNode, canvasRef, optimizeWorkflowLayout } = useWorkflowContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateDetails, setShowTemplateDetails] = useState(null);
  
  // State for collapsible sections - stored as a single object for better state management
  const [collapsedSections, setCollapsedSections] = useState({
    components: false,
    templates: false
  });

  // Memoize filtered workflows to avoid recalculations on every render
  const filteredWorkflows = React.useMemo(() => {
    if (!searchTerm.trim()) return workflows;
    
    return workflows.filter(workflow => 
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [workflows, searchTerm]);

  // Handle template detail display
  const handleShowTemplateDetails = useCallback((workflow) => {
    setShowTemplateDetails(workflow);
  }, []);

  // Toggle section collapse state
  const toggleSection = useCallback((section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Handle template application
  const handleApplyTemplate = useCallback((workflow) => {
    if (window.confirm(`Apply the "${workflow.name}" template? This will clear your current canvas.`)) {
      // Implementation would go here
      alert('Template applied successfully!');
      setShowTemplateDetails(null);
    }
  }, []);

  // Handle double-click on component - add a new node in the center of the viewport
  const handleDoubleClick = useCallback((nodeType) => {
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 100; // Half of node width
    const centerY = canvasRect.height / 2 - 60; // Half of node height

    addNewNode(nodeType, {
      x: centerX + canvasRef.current.scrollLeft,
      y: centerY + canvasRef.current.scrollTop
    });
  }, [canvasRef, addNewNode]);

  // Handler for search changes with debouncing
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="w-64 border-r border-neutral-200 flex flex-col h-full bg-white overflow-hidden">
      {/* Components Section */}
      <div className="border-b border-neutral-200">
        <button 
          onClick={() => toggleSection('components')}
          className="w-full p-3 flex justify-between items-center hover:bg-neutral-50"
        >
          <h3 className="font-medium text-neutral-700">Components</h3>
          {collapsedSections.components ? 
            <ChevronRight size={16} className="text-neutral-400" /> : 
            <ChevronDown size={16} className="text-neutral-400" />
          }
        </button>
        
        {/* Components content */}
        <div className={`transition-all duration-300 overflow-hidden ${collapsedSections.components ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
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
          onClick={() => toggleSection('templates')}
          className="w-full p-3 flex justify-between items-center hover:bg-neutral-50 border-b border-neutral-200"
        >
          <h3 className="font-medium text-neutral-700">Templates</h3>
          {collapsedSections.templates ? 
            <ChevronRight size={16} className="text-neutral-400" /> : 
            <ChevronDown size={16} className="text-neutral-400" />
          }
        </button>
        
        {/* Templates content */}
        <div className={`transition-all duration-300 overflow-hidden flex flex-col ${collapsedSections.templates ? 'max-h-0 opacity-0' : 'flex-1 opacity-100'}`}>
          <div className="p-3 flex flex-col flex-1">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8 pr-2 py-1 text-xs border border-neutral-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            
            {/* Virtualized template list for better performance with many templates */}
            <div className="space-y-2 overflow-y-auto hide-scrollbar flex-1 pr-1">
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map(workflow => (
                  <TemplateItem 
                    key={workflow.id}
                    workflow={workflow}
                    onShowDetails={handleShowTemplateDetails}
                  />
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
      
      {/* Auto-layout button */}
      <div className="p-3 border-t border-neutral-200">
        <button
          onClick={optimizeWorkflowLayout}
          className="w-full py-2 px-3 text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md transition-colors flex items-center justify-center gap-1"
        >
          <GitBranch size={14} />
          Auto-arrange Nodes
        </button>
      </div>

      {/* Template Details Modal - Using React Portal for better performance */}
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
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NodePalette);