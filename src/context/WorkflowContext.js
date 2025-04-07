// src/context/WorkflowContext.js
// Add or update the connection handling functions

// Add this function to WorkflowContext.js
const createConnection = useCallback((source, target) => {
  // Generate a unique ID for the connection
  const connectionId = `conn-${source}-${target}-${Date.now()}`;
  
  // Check for duplicates to prevent multiple connections between the same nodes
  const isDuplicate = connections.some(conn => 
    conn.source === source && conn.target === target
  );
  
  if (isDuplicate) {
    console.warn('Connection already exists between these nodes');
    return null;
  }
  
  // Check for self-connections
  if (source === target) {
    console.warn('Cannot connect a node to itself');
    return null;
  }
  
  // Create the new connection object
  const newConnection = {
    id: connectionId,
    source,
    target
  };
  
  console.log('Creating new connection:', newConnection);
  
  // Update the connections state
  setConnections(prevConnections => [...prevConnections, newConnection]);
  
  return newConnection;
}, [connections]);

// Updated deleteConnection function to properly handle edge IDs
const deleteConnection = useCallback((connectionId) => {
  console.log('Deleting connection:', connectionId);
  
  setConnections(prevConnections => 
    prevConnections.filter(conn => conn.id !== connectionId)
  );
}, []);

// Make sure to add createConnection to the context value object:
const value = useMemo(() => ({
  // ... existing values
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
  createConnection, // Add this
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
  createConnection, // Add this
  duplicateNode,
  handleNodeTextChange,
  handleNodeTitleChange,
  clearCanvas,
  exportWorkflow,
  importWorkflow,
  optimizeWorkflowLayout,
  batchUpdateNodePositions
]);