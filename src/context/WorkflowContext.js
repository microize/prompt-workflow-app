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
  const [lastCreatedNodeId, setLastCreatedNodeId] = useState(null);
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
    
    const newNodeId = Date.now().toString();
    const newNode = {
      id: newNodeId,
      type: type,
      title: type === 'prompt' ? 'New Prompt' : 
             type === 'action' ? 'New Action' : 'New Condition',
      position: nodePosition,
      content: type === 'prompt' ? 'Enter your prompt here...' : 
               type === 'action' ? 'Action configuration' : 'Condition settings'
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setLastCreatedNodeId(newNodeId);
    return newNode;
  }, [canvasRef]);
  
  // Improved node drag handling
  const handleNodeMouseDown = useCallback((e, node) => {
    e.stopPropagation();
    
    // Only start dragging if we're in the header area
    const target = e.target;
    if (!target.closest('.node-header')) {
      return;
    }
    
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
    
    // Add event listeners to handle drag on the whole document
    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startPosition.x;
      const dy = moveEvent.clientY - startPosition.y;
      
      setNodes(prevNodes => prevNodes.map(n => {
        if (n.id === node.id) {
          // Calculate new position with boundaries
          let newX = Math.max(0, nodeDragStart.x + dx);
          let newY = Math.max(0, nodeDragStart.y + dy);
          
          if (canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            newX = Math.min(newX, canvasRect.width - 200); // Assuming node width is 200px
          }
          
          return {
            ...n,
            position: {
              x: newX,
              y: newY
            }
          };
        }
        return n;
      }));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setCurrentNode(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);
  
  // Improved canvas mouse move handler
  const handleCanvasMouseMove = useCallback((e) => {
    // Connection drawing logic only - node dragging is handled separately now
    if (isDrawingConnection && connectionStart) {
      // Get canvas coordinates
      const canvasRect = canvasRef.current.getBoundingClientRect();
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
  }, [isDrawingConnection, connectionStart]);
  
  // Improved canvas mouse up handler
  const handleCanvasMouseUp = useCallback((e) => {
    // Finish connection drawing if we have a target
    if (isDrawingConnection && potentialTarget) {
      // Create new connection
      const newConnection = {
        id: `conn-${connectionStart.nodeId}-${potentialTarget.nodeId}`,
        source: connectionStart.nodeId,
        target: potentialTarget.nodeId
      };
      
      // Check if connection already exists to prevent duplicates
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
  
  // Improved connection drawing start
  const startConnectionDraw = useCallback((e, node, handleType) => {
    e.stopPropagation();
    e.preventDefault();
    
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
    
    // Create temporary event listeners for drawing
    const handleMouseMove = (moveEvent) => {
      setConnectionEnd({
        x: moveEvent.clientX,
        y: moveEvent.clientY
      });
      
      // Check for potential targets
      const handleElements = document.querySelectorAll('[data-handle-type="input"]');
      let foundTarget = null;
      
      handleElements.forEach(handleEl => {
        const rect = handleEl.getBoundingClientRect();
        const targetNodeId = handleEl.getAttribute('data-node-id');
        
        // Don't connect to the same node
        if (targetNodeId !== node.id) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(moveEvent.clientX - centerX, 2) + 
            Math.pow(moveEvent.clientY - centerY, 2)
          );
          
          if (distance < 20) {
            foundTarget = {
              nodeId: targetNodeId,
              x: centerX,
              y: centerY
            };
          }
        }
      });
      
      setPotentialTarget(foundTarget);
    };
    
    const handleMouseUp = (upEvent) => {
      // Create connection if we have a target
      if (potentialTarget) {
        const newConnection = {
          id: `conn-${node.id}-${potentialTarget.nodeId}`,
          source: node.id,
          target: potentialTarget.nodeId
        };
        
        // Check for duplicates
        const isDuplicate = connections.some(conn => 
          conn.source === newConnection.source && conn.target === newConnection.target
        );
        
        if (!isDuplicate) {
          setConnections(prev => [...prev, newConnection]);
        }
      }
      
      // Reset states
      setIsDrawingConnection(false);
      setConnectionStart(null);
      setConnectionEnd({ x: 0, y: 0 });
      setPotentialTarget(null);
      
      // Remove temporary listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [connections, potentialTarget]);
  
  // Connection drawing end point handler
  const endConnectionDraw = useCallback((e, node, handleType) => {
    // Only allow ending on input handles
    if (handleType !== 'input' || !isDrawingConnection) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Only create connection if we have a valid start
    if (connectionStart && connectionStart.nodeId !== node.id) {
      const newConnection = {
        id: `conn-${connectionStart.nodeId}-${node.id}`,
        source: connectionStart.nodeId,
        target: node.id
      };
      
      // Check for duplicates
      const isDuplicate = connections.some(conn => 
        conn.source === newConnection.source && conn.target === newConnection.target
      );
      
      if (!isDuplicate) {
        setConnections(prev => [...prev, newConnection]);
      }
    }
    
    // Reset connection drawing state
    setIsDrawingConnection(false);
    setConnectionStart(null);
    setConnectionEnd({ x: 0, y: 0 });
    setPotentialTarget(null);
  }, [isDrawingConnection, connectionStart, connections]);
  
  // Improved node deletion with confirmation
  const deleteNode = useCallback((nodeId) => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      // First, remove any connections involving this node
      setConnections(prevConnections => prevConnections.filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      ));
      
      // Then remove the node
      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    }
  }, []);
  
  // Improved connection deletion with confirmation
  const deleteConnection = useCallback((connectionId) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      setConnections(prevConnections => 
        prevConnections.filter(conn => conn.id !== connectionId)
      );
    }
  }, []);
  
  // Duplicate a node
  const duplicateNode = useCallback((nodeId) => {
    const nodeToDuplicate = nodes.find(node => node.id === nodeId);
    if (!nodeToDuplicate) return;
    
    const newNode = {
      ...nodeToDuplicate,
      id: Date.now().toString(),
      position: {
        x: nodeToDuplicate.position.x + 30,
        y: nodeToDuplicate.position.y + 30
      }
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    return newNode.id;
  }, [nodes]);
  
  // Update node text content
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
  
  // Update node title
  const handleNodeTitleChange = useCallback((nodeId, newTitle) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          title: newTitle
        };
      }
      return node;
    }));
  }, []);
  
  // Clear canvas with confirmation
  const clearCanvas = useCallback(() => {
    if (nodes.length === 0) return;
    
    if (window.confirm("Are you sure you want to clear the canvas? This will remove all nodes and connections.")) {
      setNodes([]);
      setConnections([]);
    }
  }, [nodes.length]);
  
  // Export workflow as JSON
  const exportWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      alert('No workflow to export');
      return;
    }

    const workflow = {
      nodes: nodes,
      connections: connections,
      exportedAt: new Date().toISOString()
    };

    // Create a download link for the JSON file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `workflow-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [nodes, connections]);
  
  // Import workflow from JSON
  const importWorkflow = useCallback((jsonData) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!parsedData.nodes || !Array.isArray(parsedData.nodes) || 
          !parsedData.connections || !Array.isArray(parsedData.connections)) {
        throw new Error("Invalid workflow data format");
      }
      
      setNodes(parsedData.nodes);
      setConnections(parsedData.connections);
      
      return true;
    } catch (error) {
      console.error("Failed to import workflow:", error);
      alert("Failed to import workflow: " + error.message);
      return false;
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
    lastCreatedNodeId,
    
    // Functions
    addNewNode,
    handleNodeMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    startConnectionDraw,
    endConnectionDraw,
    deleteNode,
    deleteConnection,
    duplicateNode,
    handleNodeTextChange,
    handleNodeTitleChange,
    clearCanvas,
    exportWorkflow,
    importWorkflow
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;