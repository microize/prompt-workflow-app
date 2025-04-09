import React, { createContext, useState, useContext, useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const WorkflowContext = createContext();

// Custom hook to use the context
export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within a WorkflowContextProvider');
  }
  return context;
};

export const WorkflowContextProvider = ({ children }) => {
  // State for nodes and connections
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [lastCreatedNodeId, setLastCreatedNodeId] = useState(null);
  
  // Ref for the canvas element
  const canvasRef = useRef(null);
  
  // Create lookup maps for better performance
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    return map;
  }, [nodes]);
  
  const connectionMap = useMemo(() => {
    const map = {};
    connections.forEach(conn => {
      map[conn.id] = conn;
    });
    return map;
  }, [connections]);

  // Add a new node to the workflow
  const addNewNode = useCallback((type, position = null) => {
    if (!canvasRef.current && !position) {
      position = { x: 100, y: 100 };
    }
    const newNodeId = `node-${uuidv4()}`;
    const newNode = {
      id: newNodeId,
      type,
      title: type === 'prompt' ? 'New Prompt' : 
             type === 'action' ? 'New Action' : 'New Condition',
      position: position || {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50
      },
      content: type === 'prompt' ? 'Enter your prompt here...' : 
               type === 'action' ? 'Configure your action' : 'Define your condition'
    };
    setNodes(prevNodes => [...prevNodes, newNode]);
    setLastCreatedNodeId(newNodeId);
    return newNode;
  }, [canvasRef]);

  // Delete a node and its connections
  const deleteNode = useCallback((nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setConnections(prevConnections => prevConnections.filter(
      conn => conn.source !== nodeId && conn.target !== nodeId
    ));
  }, []);

  // Duplicate a node
  const duplicateNode = useCallback((nodeId) => {
    const nodeToDuplicate = nodes.find(node => node.id === nodeId);
    if (!nodeToDuplicate) return;
    const newNodeId = `node-${uuidv4()}`;
    const newNode = {
      ...nodeToDuplicate,
      id: newNodeId,
      position: {
        x: nodeToDuplicate.position.x + 30,
        y: nodeToDuplicate.position.y + 30
      }
    };
    setNodes(prevNodes => [...prevNodes, newNode]);
    setLastCreatedNodeId(newNodeId);
    return newNodeId;
  }, [nodes]);

  // Delete a connection
  const deleteConnection = useCallback((connectionId) => {
    setConnections(prevConnections => 
      prevConnections.filter(conn => conn.id !== connectionId)
    );
  }, []);

  // Create a new connection between nodes
  const createConnection = useCallback((source, target) => {
    const connectionId = `conn-${source}-${target}-${Date.now()}`;
    const isDuplicate = connections.some(conn => 
      conn.source === source && conn.target === target
    );
    if (isDuplicate) {
      console.warn('Connection already exists between these nodes');
      return null;
    }
    if (source === target) {
      console.warn('Cannot connect a node to itself');
      return null;
    }
    const newConnection = {
      id: connectionId,
      source,
      target
    };
    setConnections(prevConnections => [...prevConnections, newConnection]);
    return newConnection;
  }, [connections]);

  // Update node content
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
          title: newTitle || node.title
        };
      }
      return node;
    }));
  }, []);

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the canvas? This will remove all nodes and connections.")) {
      setNodes([]);
      setConnections([]);
    }
  }, []);

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

  // Optimize workflow layout
  const optimizeWorkflowLayout = useCallback(() => {
    if (nodes.length <= 1) {
      alert("Not enough nodes to optimize layout");
      return;
    }
    const spacingX = 300;
    const spacingY = 200;
    const columns = Math.ceil(Math.sqrt(nodes.length));
    const updatedNodes = nodes.map((node, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      return {
        ...node,
        position: {
          x: col * spacingX + 50,
          y: row * spacingY + 50
        }
      };
    });
    setNodes(updatedNodes);
  }, [nodes]);

  // Batch update node positions
  const batchUpdateNodePositions = useCallback((updates) => {
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        if (updates[node.id]) {
          return {
            ...node,
            position: updates[node.id]
          };
        }
        return node;
      });
    });
  }, []);

  // Value object to provide through context
  const value = useMemo(() => ({
    nodes,
    connections,
    lastCreatedNodeId,
    canvasRef,
    nodeMap,
    connectionMap,
    addNewNode,
    deleteNode,
    deleteConnection,
    createConnection,
    duplicateNode,
    handleNodeTextChange,
    handleNodeTitleChange,
    clearCanvas,
    exportWorkflow,
    importWorkflow,
    optimizeWorkflowLayout,
    batchUpdateNodePositions
  }), [
    nodes, 
    connections,
    lastCreatedNodeId,
    nodeMap,
    connectionMap,
    addNewNode,
    deleteNode,
    deleteConnection,
    createConnection,
    duplicateNode,
    handleNodeTextChange,
    handleNodeTitleChange,
    clearCanvas,
    exportWorkflow,
    importWorkflow,
    optimizeWorkflowLayout,
    batchUpdateNodePositions
  ]);

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;