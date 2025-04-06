import React, { createContext, useState, useContext, useRef, useCallback } from 'react';

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
  const [potentialTarget, setPotentialTarget] = useState(null);
  const canvasRef = useRef(null);

  // Functions for managing nodes
  const addNewNode = useCallback((type, position = null) => {
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    let nodePosition;
    
    if (position) {
      nodePosition = position;
    } else {
      // Default position in the center or with some randomness
      nodePosition = {
        x: Math.max(50, Math.random() * (canvasRect.width - 250)),
        y: Math.max(50, Math.random() * (canvasRect.height - 150))
      };
    }
    
    const newNode = {
      id: Date.now().toString(),
      type: type,
      title: type === 'prompt' ? 'New Prompt' : 
             type === 'action' ? 'New Action' : 'New Condition',
      position: nodePosition,
      content: type === 'prompt' ? 'Enter your prompt here...' : 
               type === 'action' ? 'Action configuration' : 'Condition settings'
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    return newNode;
  }, [canvasRef]);
  
  const handleNodeMouseDown = useCallback((e, node) => {
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
  }, []);
  
  const handleCanvasMouseMove = useCallback((e) => {
    // Node dragging
    if (isDragging && currentNode) {
      const dx = e.clientX - startPosition.x;
      const dy = e.clientY - startPosition.y;
      
      setNodes(prevNodes => prevNodes.map(node => {
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
    
    // Connection drawing
    if (isDrawingConnection && connectionStart) {
      setConnectionEnd({
        x: e.clientX,
        y: e.clientY
      });
      
      // Check if we're hovering over a potential connection target
      const handleElements = document.querySelectorAll('[data-handle-type="input"]');
      let foundTarget = null;
      
      handleElements.forEach(handleEl => {
        const rect = handleEl.getBoundingClientRect();
        const nodeId = handleEl.getAttribute('data-node-id');
        
        // Make sure we're not trying to connect to the same node
        if (nodeId !== connectionStart.nodeId) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) + 
            Math.pow(e.clientY - centerY, 2)
          );
          
          // If cursor is within 20px of the handle center
          if (distance < 20) {
            foundTarget = {
              nodeId,
              x: centerX,
              y: centerY
            };
          }
        }
      });
      
      setPotentialTarget(foundTarget);
    }
  }, [isDragging, currentNode, startPosition, nodeDragStart, isDrawingConnection, connectionStart]);
  
  const handleCanvasMouseUp = useCallback((e) => {
    // Release dragged node
    if (isDragging) {
      setIsDragging(false);
      setCurrentNode(null);
    }
    
    // Finish connection drawing if we have a target
    if (isDrawingConnection && potentialTarget) {
      // Create new connection
      const newConnection = {
        id: `conn-${connectionStart.nodeId}-${potentialTarget.nodeId}`,
        source: connectionStart.nodeId,
        target: potentialTarget.nodeId
      };
      
      // Check if connection already exists
      const isDuplicate = connections.some(conn => 
        conn.source === newConnection.source && conn.target === newConnection.target
      );
      
      if (!isDuplicate) {
        setConnections(prev => [...prev, newConnection]);
      }
    }
    
    // Reset connection drawing state
    if (isDrawingConnection) {
      setIsDrawingConnection(false);
      setConnectionStart(null);
      setConnectionEnd({ x: 0, y: 0 });
      setPotentialTarget(null);
    }
  }, [isDrawingConnection, potentialTarget, connectionStart, connections]);
  
  const startConnectionDraw = useCallback((e, node, handleType) => {
    e.stopPropagation();
    
    // Only allow starting connection from output handle
    if (handleType !== 'output') return;
    
    setIsDrawingConnection(true);
    
    // Get the position of the output handle
    const handleElement = e.currentTarget;
    const rect = handleElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    setConnectionStart({
      nodeId: node.id,
      x: startX,
      y: startY
    });
    
    setConnectionEnd({
      x: e.clientX,
      y: e.clientY
    });
  }, []);
  
  const endConnectionDraw = useCallback((e, node, handleType) => {
    // This is handled by handleCanvasMouseUp via the potentialTarget state
  }, []);
  
  const deleteNode = useCallback((nodeId) => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      
      // Also delete any connections to/from this node
      setConnections(prevConnections => prevConnections.filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      ));
    }
  }, []);
  
  const deleteConnection = useCallback((connectionId) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
  }, []);
  
  const handleNodeTextChange = useCallback((nodeId, newText) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          content: newText
        };
      }
      return node;
    }));
  }, []);
  
  const clearCanvas = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the canvas? This will remove all nodes and connections.")) {
      setNodes([]);
      setConnections([]);
    }
  }, []);

  // Value object to provide through context
  const value = {
    // State
    nodes,
    setNodes,
    connections,
    setConnections,
    isDragging,
    isDrawingConnection,
    connectionStart,
    connectionEnd,
    potentialTarget,
    canvasRef,
    
    // Functions
    addNewNode,
    handleNodeMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    startConnectionDraw,
    endConnectionDraw,
    deleteNode,
    deleteConnection,
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