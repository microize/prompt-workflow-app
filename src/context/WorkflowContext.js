import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { useAppContext } from './AppContext';

// Create context
const WorkflowContext = createContext();

// Custom hook to use the context
export const useWorkflowContext = () => useContext(WorkflowContext);

export const WorkflowContextProvider = ({ children }) => {
  const { selectedWorkflow } = useAppContext();
  
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
  
  // Load selected workflow if one is chosen
  useEffect(() => {
    if (selectedWorkflow) {
      // In a real app, this would handle conversion from template to workable nodes
      // For now, we'll just create some placeholder nodes
      const templateNodes = [
        {
          id: `template-${Date.now()}-1`,
          type: 'prompt',
          title: selectedWorkflow.steps[0]?.name || 'Template Start',
          position: { x: 100, y: 150 },
          content: selectedWorkflow.steps[0]?.prompt || 'Template content'
        }
      ];
      
      // Add more nodes if there are more steps
      if (selectedWorkflow.steps.length > 1) {
        selectedWorkflow.steps.slice(1).forEach((step, index) => {
          templateNodes.push({
            id: `template-${Date.now()}-${index+2}`,
            type: index % 2 === 0 ? 'action' : 'condition',
            title: step.name,
            position: { x: 100 + (index+1) * 250, y: 150 },
            content: step.prompt
          });
        });
        
        // Create connections between the nodes
        const templateConnections = [];
        for (let i = 0; i < templateNodes.length - 1; i++) {
          templateConnections.push({
            id: `conn-${templateNodes[i].id}-${templateNodes[i+1].id}`,
            source: templateNodes[i].id,
            target: templateNodes[i+1].id
          });
        }
        
        setConnections(templateConnections);
      }
      
      setNodes(templateNodes);
    }
  }, [selectedWorkflow]);

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
        x: Math.max(50, Math.random() * ((canvasRect.width / 2) - 250) + 100),
        y: Math.max(50, Math.random() * ((canvasRect.height / 2) - 150) + 100)
      };
    }
    
    const newNodeId = `node-${Date.now()}`; // Ensure unique ID format
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
  
  // Improved node drag handling with proper cleanup
  const handleNodeMouseDown = useCallback((e, node) => {
    // Prevent default behavior to avoid text selection
    e.preventDefault();
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
    
    // Define the handlers outside the add/remove cycle
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      
      if (!isDragging || !currentNode) return;
      
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
    
    const handleMouseUp = (upEvent) => {
      upEvent.preventDefault();
      setIsDragging(false);
      setCurrentNode(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners to handle drag on the whole document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [canvasRef, currentNode, isDragging, nodeDragStart, startPosition]);
  
  // Improved canvas mouse move handler
  const handleCanvasMouseMove = useCallback((e) => {
    // Only handle connection drawing logic here
    if (isDrawingConnection && connectionStart) {
      // Get canvas coordinates
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const canvasX = e.clientX - canvasRect.left + canvasRef.current.scrollLeft;
      const canvasY = e.clientY - canvasRect.top + canvasRef.current.scrollTop;
      
      setConnectionEnd({
        x: canvasX,
        y: canvasY
      });
      
      // Check if we're hovering over a potential connection target
      const handleElements = document.querySelectorAll('[data-handle-type="input"]');
      let foundTarget = null;
      
      handleElements.forEach(handleEl => {
        const rect = handleEl.getBoundingClientRect();
        const nodeId = handleEl.getAttribute('data-node-id');
        
        // Make sure we're not trying to connect to the same node
        if (nodeId !== connectionStart.nodeId) {
          const centerX = rect.left - canvasRect.left + canvasRef.current.scrollLeft + rect.width / 2;
          const centerY = rect.top - canvasRect.top + canvasRef.current.scrollTop + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(canvasX - centerX, 2) + 
            Math.pow(canvasY - centerY, 2)
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
    
    // Set drawing state
    setIsDrawingConnection(true);
    
    // Get the position of the output handle
    const handleElement = e.currentTarget;
    const rect = handleElement.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate position relative to the canvas
    const startX = rect.left - canvasRect.left + canvasRef.current.scrollLeft + rect.width / 2;
    const startY = rect.top - canvasRect.top + canvasRef.current.scrollTop + rect.height / 2;
    
    setConnectionStart({
      nodeId: node.id,
      x: startX,
      y: startY
    });
    
    setConnectionEnd({
      x: startX,
      y: startY
    });
  }, [canvasRef]);
  
  // Connection drawing end point handler
  const endConnectionDraw = useCallback((e, node, handleType) => {
    // Only allow ending on input handles
    if (handleType !== 'input' || !isDrawingConnection || !connectionStart) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Only create connection if we have a valid start and it's not the same node
    if (connectionStart.nodeId !== node.id) {
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
      id: `node-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 30,
        y: nodeToDuplicate.position.y + 30
      }
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setLastCreatedNodeId(newNode.id);
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
          title: newTitle || node.title // Prevent empty titles
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
      
      // Validate node structure
      const validNodes = parsedData.nodes.every(node => 
        node.id && node.type && node.position && 
        typeof node.position.x === 'number' && 
        typeof node.position.y === 'number'
      );
      
      if (!validNodes) {
        throw new Error("Invalid node structure in imported data");
      }
      
      // Validate connections structure
      const validConnections = parsedData.connections.every(conn => 
        conn.id && conn.source && conn.target
      );
      
      if (!validConnections) {
        throw new Error("Invalid connection structure in imported data");
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