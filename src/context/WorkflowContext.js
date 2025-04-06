import React, { createContext, useState, useContext, useRef } from 'react';

// Create context
const WorkflowContext = createContext();

// Custom hook to use the context
export const useWorkflowContext = () => useContext(WorkflowContext);

export const WorkflowContextProvider = ({ children }) => {
  // State for workflow canvas
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 });
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionEnd, setConnectionEnd] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Functions for managing nodes
  const addNewNode = (type) => {
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newNode = {
      id: Date.now(),
      type: type,
      title: type === 'prompt' ? 'New Prompt' : 
             type === 'action' ? 'New Action' : 'New Condition',
      position: {
        x: canvasRect.width / 2 - 100, 
        y: canvasRect.height / 2 - 60
      },
      content: type === 'prompt' ? 'Enter your prompt here...' : 
               type === 'action' ? 'Action configuration' : 'Condition settings'
    };
    
    setNodes([...nodes, newNode]);
  };
  
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setIsDragging(true);
    setCurrentNode(node);
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
    setNodeDragStart({
      x: node.position.x,
      y: node.position.y
    });
  };
  
  const handleCanvasMouseMove = (e) => {
    if (isDragging && currentNode) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;
      
      setNodes(nodes.map(node => {
        if (node.id === currentNode.id) {
          return {
            ...node,
            position: {
              x: nodeDragStart.x + dx,
              y: nodeDragStart.y + dy
            }
          };
        }
        return node;
      }));
    }
    
    if (isDrawingConnection) {
      setConnectionEnd({
        x: e.clientX - canvasRef.current.getBoundingClientRect().left,
        y: e.clientY - canvasRef.current.getBoundingClientRect().top
      });
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setCurrentNode(null);
    
    if (isDrawingConnection) {
      // Find if there's a node at the end position
      const targetNode = nodes.find(node => {
        const nodeRect = {
          left: node.position.x,
          right: node.position.x + 200,
          top: node.position.y,
          bottom: node.position.y + 120
        };
        
        return connectionEnd.x >= nodeRect.left && connectionEnd.x <= nodeRect.right &&
               connectionEnd.y >= nodeRect.top && connectionEnd.y <= nodeRect.bottom &&
               node.id !== connectionStart.id;
      });
      
      if (targetNode) {
        setConnections([
          ...connections,
          {
            id: Date.now(),
            source: connectionStart.id,
            target: targetNode.id
          }
        ]);
      }
      
      setIsDrawingConnection(false);
      setConnectionStart(null);
    }
  };
  
  const startConnectionDraw = (e, node) => {
    e.stopPropagation();
    setIsDrawingConnection(true);
    setConnectionStart(node);
    const rect = canvasRef.current.getBoundingClientRect();
    setConnectionEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setConnections(connections.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
  };
  
  const handleNodeTextChange = (nodeId, newText) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          content: newText
        };
      }
      return node;
    }));
  };
  
  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
  };

  // Value object to provide through context
  const value = {
    // State
    nodes,
    connections,
    isDragging,
    isDrawingConnection,
    connectionStart,
    connectionEnd,
    canvasRef,
    
    // Functions
    addNewNode,
    handleNodeMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    startConnectionDraw,
    deleteNode,
    handleNodeTextChange,
    clearCanvas
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;