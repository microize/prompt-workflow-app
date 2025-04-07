// src/components/workflow/Canvas.js
import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowContext } from '../../context/WorkflowContext';
import CustomNode from './CustomNode';
import { shallow } from 'zustand/shallow';
import { ZoomIn, ZoomOut, Maximize, Search, Save } from 'lucide-react';

// Node types for the workflow canvas
const nodeTypes = {
  promptNode: CustomNode,
  actionNode: CustomNode,
  conditionNode: CustomNode,
};

// Edge types with different styles
const getFitViewOptions = (nodes) => ({
  padding: 0.2,
  includeHiddenNodes: false,
  minZoom: 0.5,
  maxZoom: 2,
});

// Main Canvas Component
const Canvas = () => {
  // Set up state for nodes and edges (connections)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElements, setSelectedElements] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { fitView } = useReactFlow();
  
  // Get context values from WorkflowContext
  const {
    nodes: contextNodes,
    connections: contextConnections,
    addNewNode,
    deleteNode,
    duplicateNode,
    deleteConnection,
    handleNodeTextChange,
    handleNodeTitleChange,
    clearCanvas,
  } = useWorkflowContext();
  
  const reactFlowWrapper = useRef(null);

  // Convert WorkflowContext nodes to ReactFlow format
  useEffect(() => {
    if (contextNodes.length > 0) {
      const flowNodes = contextNodes.map(node => ({
        id: node.id,
        type: `${node.type}Node`, // Map to our custom node types
        position: node.position,
        data: {
          title: node.title,
          content: node.content,
          type: node.type,
          onTitleChange: (id, title) => handleNodeTitleChange(id, title),
          onContentChange: (id, content) => handleNodeTextChange(id, content),
          onDuplicate: (id) => duplicateNode(id),
          onDelete: (id) => deleteNode(id),
        },
      }));
      
      setNodes(flowNodes);
    } else {
      setNodes([]);
    }
  }, [contextNodes, handleNodeTextChange, handleNodeTitleChange, duplicateNode, deleteNode]);

  // Convert WorkflowContext connections to ReactFlow edges
  useEffect(() => {
    if (contextConnections.length > 0) {
      const flowEdges = contextConnections.map(connection => {
        // Find source node type to set proper styling
        const sourceNode = contextNodes.find(n => n.id === connection.source);
        const edgeStyle = sourceNode ? sourceNode.type : 'default';
        
        return {
          id: connection.id,
          source: connection.source,
          target: connection.target,
          type: 'smoothstep',
          animated: false,
          style: { 
            strokeWidth: 2,
            stroke: edgeStyle === 'prompt' ? '#4285f4' : 
                    edgeStyle === 'action' ? '#a142f4' : 
                    edgeStyle === 'condition' ? '#fbbc04' : '#94a3b8'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeStyle === 'prompt' ? '#4285f4' : 
                   edgeStyle === 'action' ? '#a142f4' : 
                   edgeStyle === 'condition' ? '#fbbc04' : '#94a3b8',
          },
          data: {
            onDelete: () => deleteConnection(connection.id),
          }
        };
      });
      
      setEdges(flowEdges);
    } else {
      setEdges([]);
    }
  }, [contextConnections, contextNodes, deleteConnection]);

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedElements(nodes.length || edges.length ? { nodes, edges } : null);
  }, []);

  // Handle connection creation
  const onConnect = useCallback((params) => {
    // Generate a unique connection ID
    const newConnectionId = `conn-${params.source}-${params.target}-${Date.now()}`;
    
    // Check if connection already exists to prevent duplicates
    const isDuplicate = contextConnections.some(conn => 
      conn.source === params.source && conn.target === params.target
    );
    
    if (!isDuplicate) {
      // Add the new connection to the WorkflowContext
      const newConnection = {
        id: newConnectionId,
        source: params.source,
        target: params.target
      };
      
      // Update context connections
      const updatedConnections = [...contextConnections, newConnection];
      
      // This will trigger the useEffect that updates edges
      // No need to directly set edges here
    }
  }, [contextConnections]);

  // Handle dropping node on canvas
  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    if (!reactFlowInstance || !reactFlowWrapper.current) return;
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    
    // Check if the dropped element is valid
    if (typeof type === 'undefined' || !type) return;
    
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    // Add new node via the context
    addNewNode(type, position);
  }, [reactFlowInstance, addNewNode]);

  // Setup drag over handler for the drop target
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle fitting view (auto-center and zoom to show all nodes)
  const onFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView(getFitViewOptions(nodes));
    }
  }, [reactFlowInstance, nodes]);

  // Handle deleting selected elements
  const onDeleteSelected = useCallback(() => {
    if (!selectedElements) return;
    
    // Delete selected edges
    selectedElements.edges.forEach(edge => {
      deleteConnection(edge.id);
    });
    
    // Delete selected nodes
    selectedElements.nodes.forEach(node => {
      deleteNode(node.id);
    });
    
    setSelectedElements(null);
  }, [selectedElements, deleteConnection, deleteNode]);

  // Add keyboard shortcuts
  useEffect(() => {
    const keyHandler = (event) => {
      // Delete key for selected elements
      if (event.key === 'Delete' && selectedElements) {
        onDeleteSelected();
      }
      
      // Ctrl+F to fit view
      if (event.key === 'f' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onFitView();
      }
      
      // Ctrl+C, Ctrl+V for copy/paste (would require more implementation)
    };
    
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [selectedElements, onDeleteSelected, onFitView]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={getFitViewOptions(nodes)}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        selectionKeyCode="Shift"
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnDrag={true}
        selectNodesOnDrag={false}
        preventScrolling={true}
        minZoom={0.1}
        maxZoom={4}
        snapToGrid={true}
        snapGrid={[15, 15]}
        className="bg-neutral-50"
      >
        <Background 
          color="#e8eaed" 
          gap={20} 
          size={1} 
          variant="dots" 
        />
        <Controls 
          position="bottom-right"
          showInteractive={false}
        />
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            switch (node.data.type) {
              case 'prompt': return '#4285f4';
              case 'action': return '#a142f4';
              case 'condition': return '#fbbc04';
              default: return '#94a3b8';
            }
          }}
          maskColor="rgba(248, 249, 250, 0.5)"
        />
        
        {/* Custom control panel */}
        <Panel position="top-right" className="bg-white rounded-lg shadow-md p-2 flex flex-col space-y-2">
          <button 
            onClick={onFitView}
            className="p-1 hover:bg-neutral-100 rounded-md tooltip" 
            title="Fit View (Ctrl+F)"
          >
            <Maximize size={18} />
          </button>
          <button 
            onClick={() => {
              if (reactFlowInstance) {
                reactFlowInstance.zoomIn({ duration: 300 });
              }
            }}
            className="p-1 hover:bg-neutral-100 rounded-md" 
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button 
            onClick={() => {
              if (reactFlowInstance) {
                reactFlowInstance.zoomOut({ duration: 300 });
              }
            }}
            className="p-1 hover:bg-neutral-100 rounded-md"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
        </Panel>
        
        {/* Empty state - only shown when no nodes */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 pointer-events-none">
            <div className="text-center p-6 rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                <div className="text-neutral-300 mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-neutral-500 mb-2">Start Building Your Workflow</h3>
                <p className="text-neutral-400 mb-4">Drag components from the left panel onto this canvas or use the buttons below</p>
                <div className="flex gap-2 pointer-events-auto">
                  <button 
                    onClick={() => addNewNode('prompt')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                  >
                    Add Prompt
                  </button>
                  <button 
                    onClick={() => addNewNode('action')}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                  >
                    Add Action
                  </button>
                  <button 
                    onClick={() => addNewNode('condition')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
                  >
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Canvas navigation guide */}
        <Panel position="bottom-left" className="bg-white rounded-lg shadow-md p-2 text-xs text-neutral-500">
          <p>Right-click: Context menu</p>
          <p>Drag: Pan canvas</p>
          <p>Scroll: Zoom in/out</p>
          <p>Shift+Click: Select multiple</p>
          <p>Delete: Remove selected</p>
          <p>Ctrl+F: Fit view</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrap the component with ReactFlowProvider
const CanvasWithProvider = () => (
  <ReactFlowProvider>
    <Canvas />
  </ReactFlowProvider>
);

export default CanvasWithProvider;