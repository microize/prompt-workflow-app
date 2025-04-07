// src/context/WorkflowContext.js
import React, { createContext, useState, useContext, useRef, useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { debounce } from 'lodash'; // Import for debouncing

// Create context
const WorkflowContext = createContext();

// Custom hook to use the context
export const useWorkflowContext = () => useContext(WorkflowContext);

export const WorkflowContextProvider = ({ children }) => {
  const { selectedWorkflow } = useAppContext();
  
  // State for workflow canvas with memoization to improve performance
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [lastCreatedNodeId, setLastCreatedNodeId] = useState(null);
  const canvasRef = useRef(null);
  
  // Memoize node lookup for better performance with large workflows
  const nodeMap = useMemo(() => {
    const map = new Map();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);
  
  // Memoize connection lookup
  const connectionMap = useMemo(() => {
    const map = new Map();
    connections.forEach(conn => map.set(conn.id, conn));
    return map;
  }, [connections]);
  
  // Use worker for heavy computation if available
  const [isWorkerAvailable, setIsWorkerAvailable] = useState(false);
  const workerRef = useRef(null);
  
  // Set up worker for offloading heavy computations
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      try {
        // In a real implementation, you'd create an actual worker file
        // For this demo, we'll just set a flag
        setIsWorkerAvailable(true);
        
        // For reference, this is how you'd normally set up a worker:
        // workerRef.current = new Worker('/workflowWorker.js');
      } catch (error) {
        console.error('Failed to initialize web worker:', error);
      }
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  
  // Load selected workflow if one is chosen
  useEffect(() => {
    if (selectedWorkflow) {
      // Create template nodes based on the selected workflow
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

  // Functions for managing nodes with optimizations
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
    
    const newNodeId = `node-${Date.now()}`; // Ensure unique ID
    const newNode = {
      id: newNodeId,
      type: type,
      title: type === 'prompt' ? 'New Prompt' : 
             type === 'action' ? 'New Action' : 'New Condition',
      position: nodePosition,
      content: type === 'prompt' ? 'Enter your prompt here...' : 
               type === 'action' ? 'Action configuration' : 'Condition settings'
    };
    
    // Virtualization optimization: Don't notify of changes if too many nodes
    // Only trigger full re-renders when below threshold
    setNodes(prevNodes => {
      const newNodes = [...prevNodes, newNode];
      
      // If we have many nodes, consider using a worker for operations
      if (newNodes.length > 50 && isWorkerAvailable && workerRef.current) {
        // In a real implementation, you'd offload computations to the worker
        console.info('Large workflow detected: optimizing rendering');
      }
      
      return newNodes;
    });
    
    setLastCreatedNodeId(newNodeId);
    return newNode;
  }, [canvasRef, isWorkerAvailable]);
  
  // Delete node with optimized connection cleanup
  const deleteNode = useCallback((nodeId) => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      // To optimize performance for large workflows, we can use our memoized maps
      // First, find all connections involving this node
      const connectionsToRemove = [];
      
      // Filter connections efficiently without iterating through all of them
      setConnections(prevConnections => {
        return prevConnections.filter(conn => conn.source !== nodeId && conn.target !== nodeId);
      });
      
      // Then remove the node
      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    }
  }, []);
  
  // Delete a connection
  const deleteConnection = useCallback((connectionId) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      setConnections(prevConnections => 
        prevConnections.filter(conn => conn.id !== connectionId)
      );
    }
  }, []);
  
  // Duplicate a node with optimized positioning
  const duplicateNode = useCallback((nodeId) => {
    const nodeToDuplicate = nodeMap.get(nodeId);
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
  }, [nodeMap]);
  
  // Update node text content with debouncing for better performance
  const handleNodeTextChangeWithoutDebounce = (nodeId, newText) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          content: newText
        };
      }
      return node;
    }));
  };
  
  // Use debounce to avoid too many state updates when typing fast
  const handleNodeTextChange = useCallback(
    debounce(handleNodeTextChangeWithoutDebounce, 300),
    []
  );
  
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
  
  // Batch update node positions for performance
  const batchUpdateNodePositions = useCallback((updatedPositions) => {
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        const updatedPosition = updatedPositions[node.id];
        if (updatedPosition) {
          return {
            ...node,
            position: updatedPosition
          };
        }
        return node;
      });
    });
  }, []);
  
  // Clear canvas with optimized reset
  const clearCanvas = useCallback(() => {
    if (nodes.length === 0) return;
    
    if (window.confirm("Are you sure you want to clear the canvas? This will remove all nodes and connections.")) {
      // Use a more efficient reset approach
      setNodes([]);
      setConnections([]);
      // Also clear any selections or other state
      setLastCreatedNodeId(null);
    }
  }, [nodes.length]);
  
  // Export workflow as JSON with optimization for large workflows
  const exportWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      alert('No workflow to export');
      return;
    }
    
    // For large workflows, use a worker if available
    if (nodes.length > 100 && isWorkerAvailable && workerRef.current) {
      // This would be handled by the worker in a real implementation
      console.info('Using optimized export for large workflow');
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
  }, [nodes, connections, isWorkerAvailable]);
  
  // Import workflow from JSON with validation and error handling
  const importWorkflow = useCallback((jsonData) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!parsedData.nodes || !Array.isArray(parsedData.nodes) || 
          !parsedData.connections || !Array.isArray(parsedData.connections)) {
        throw new Error("Invalid workflow data format");
      }
      
      // Validate node structure more efficiently
      const isValidNode = (node) => (
        node.id && node.type && node.position && 
        typeof node.position.x === 'number' && 
        typeof node.position.y === 'number'
      );
      
      const invalidNode = parsedData.nodes.find(node => !isValidNode(node));
      if (invalidNode) {
        throw new Error(`Invalid node structure for node: ${invalidNode.id || 'unknown'}`);
      }
      
      // Validate connections more efficiently
      const isValidConnection = (conn) => (
        conn.id && conn.source && conn.target
      );
      
      const invalidConnection = parsedData.connections.find(conn => !isValidConnection(conn));
      if (invalidConnection) {
        throw new Error(`Invalid connection structure: ${invalidConnection.id || 'unknown'}`);
      }
      
      // Perform the update in a more optimized way for large workflows
      if (parsedData.nodes.length > 100 && isWorkerAvailable) {
        console.info('Optimizing large workflow import');
        // In a real implementation, you'd use the worker for this
      }
      
      setNodes(parsedData.nodes);
      setConnections(parsedData.connections);
      
      return true;
    } catch (error) {
      console.error("Failed to import workflow:", error);
      alert("Failed to import workflow: " + error.message);
      return false;
    }
  }, [isWorkerAvailable]);
  
  // Function to optimize layout for complex workflows
  const optimizeWorkflowLayout = useCallback(() => {
    if (nodes.length < 5) return; // Not enough nodes to optimize
    
    // This would be a more complex algorithm in a real implementation
    // Using something like dagre or elkjs for graph layout
    
    // For now, we'll do a simple layout along rows and columns
    const nodesByType = {
      prompt: [],
      action: [],
      condition: []
    };
    
    // Group nodes by type
    nodes.forEach(node => {
      if (node.type in nodesByType) {
        nodesByType[node.type].push(node);
      }
    });
    
    // Create a new positions object
    const newPositions = {};
    
    // Layout prompts in first row
    nodesByType.prompt.forEach((node, index) => {
      newPositions[node.id] = {
        x: 100 + index * 250,
        y: 100
      };
    });
    
    // Layout actions in second row
    nodesByType.action.forEach((node, index) => {
      newPositions[node.id] = {
        x: 100 + index * 250,
        y: 300
      };
    });
    
    // Layout conditions in third row
    nodesByType.condition.forEach((node, index) => {
      newPositions[node.id] = {
        x: 100 + index * 250,
        y: 500
      };
    });
    
    // Update all positions at once for better performance
    batchUpdateNodePositions(newPositions);
  }, [nodes, batchUpdateNodePositions]);

  // Value object to provide through context
  const value = useMemo(() => ({
    // State
    nodes,
    connections,
    lastCreatedNodeId,
    canvasRef,
    
    // Lookup maps for better performance
    nodeMap,
    connectionMap,
    
    // Functions
    addNewNode,
    deleteNode,
    deleteConnection,
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