// src/pages/WorkflowPage.js
import React, { useState, useEffect, useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useAppContext } from '../context/AppContext';
import { WorkflowContextProvider, useWorkflowContext } from '../context/WorkflowContext';
import NodePalette from '../components/workflow/NodePalette';
import Canvas from '../components/workflow/Canvas';
import WorkflowControls from '../components/workflow/WorkflowControls';
import { 
  Info, 
  Play, 
  Save, 
  Video, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Maximize,
  Minimize,
  GitBranch
} from 'lucide-react';
import Button from '../components/common/Button';

// Main content wrapper with enhanced features
const WorkflowPageContent = () => {
  const { nodes, connections, addNewNode, clearCanvas, optimizeWorkflowLayout } = useWorkflowContext();
  const [showTips, setShowTips] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPalette, setShowPalette] = useState(true);
  const canvasRef = useRef(null);

  // First-time experience management
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWorkflowWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  // Handle fullscreen toggling
  const toggleFullscreen = () => {
    const element = document.getElementById('workflow-container');
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Tips carousel content
  const tips = [
    {
      title: "Connect Nodes",
      content: "Drag from the output handle of one node to the input handle of another to create connections.",
      icon: <GitBranch size={32} className="text-primary-500" />
    },
    {
      title: "Node Types",
      content: "Use Prompt nodes for text generation, Action nodes for operations, and Condition nodes for branching logic.",
      icon: <Info size={32} className="text-primary-500" />
    },
    {
      title: "Auto-Arrange",
      content: "Use the Auto-arrange button to optimize your workflow layout with proper spacing.",
      icon: <GitBranch size={32} className="text-primary-500" />
    },
    {
      title: "Test Execution",
      content: "Run your workflow to test how it would execute, with visual indicators showing the flow.",
      icon: <Play size={32} className="text-primary-500" />
    }
  ];

  // Dismiss welcome screen and save to localStorage
  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWorkflowWelcome', 'true');
  };

  // Navigate through tips
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className="flex h-full flex-col" id="workflow-container">
      {/* Header with dynamic content */}
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Workflow Editor</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {nodes.length === 0 
              ? "Create an automated workflow by dragging components onto the canvas" 
              : `Current workflow: ${nodes.length} nodes, ${connections.length} connections`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTips(true)}
            startIcon={<Info size={16} />}
          >
            Tips
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            startIcon={isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
          
          <Button
            variant={showPalette ? "outline" : "primary"}
            size="sm"
            onClick={() => setShowPalette(!showPalette)}
          >
            {showPalette ? "Hide Palette" : "Show Palette"}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette - Collapsible */}
        {showPalette && (
          <div className="border-r border-neutral-100 transition-all duration-300 ease-in-out">
            <NodePalette />
          </div>
        )}
        
        {/* Canvas container with improved feedback */}
        <div className="flex-1 relative overflow-hidden canvas-container" id="workflow-canvas-container" ref={canvasRef}>
          <Canvas />
          
          {/* Instructional overlay for empty canvas */}
          {nodes.length === 0 && !showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-8 max-w-lg">
                <div className="mb-6 text-neutral-300">
                  <GitBranch size={64} />
                </div>
                <h3 className="text-2xl font-medium text-neutral-600 mb-3">Start Building Your Workflow</h3>
                <p className="text-neutral-500 mb-6">
                  Drag components from the left panel onto this canvas or use the quick-add buttons below
                </p>
                <div className="flex justify-center gap-3 pointer-events-auto">
                  <button 
                    onClick={() => addNewNode('prompt', { x: canvasRef.current.clientWidth / 2 - 100, y: canvasRef.current.clientHeight / 2 - 100 })}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Add Prompt
                  </button>
                  <button 
                    onClick={() => addNewNode('action', { x: canvasRef.current.clientWidth / 2, y: canvasRef.current.clientHeight / 2 })}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Add Action
                  </button>
                  <button 
                    onClick={() => addNewNode('condition', { x: canvasRef.current.clientWidth / 2 + 100, y: canvasRef.current.clientHeight / 2 + 100 })}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* First-time welcome overlay */}
          {showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-4 animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-semibold text-neutral-800">Welcome to Workflow Editor</h2>
                  <button 
                    onClick={dismissWelcome}
                    className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <GitBranch size={20} />
                      </div>
                      <h3 className="font-medium">Create Workflows</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Build automation by connecting prompts, actions, and conditions to create powerful AI workflows.
                    </p>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Play size={20} />
                      </div>
                      <h3 className="font-medium">Test & Execute</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Test your workflows in real-time and save them for future use or scheduling.
                    </p>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Save size={20} />
                      </div>
                      <h3 className="font-medium">Save & Reuse</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Save your workflows to the library and reuse them across multiple projects.
                    </p>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Video size={20} />
                      </div>
                      <h3 className="font-medium">Learn More</h3>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Explore our documentation and tutorials to get the most out of the Workflow Editor.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={prevTip}
                    className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={nextTip}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the content with WorkflowContextProvider
const WorkflowPage = () => (
  <WorkflowContextProvider>
    <DndProvider backend={HTML5Backend}>
      <WorkflowPageContent />
    </DndProvider>
  </WorkflowContextProvider>
);

export default WorkflowPage;