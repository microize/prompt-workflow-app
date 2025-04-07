// public/workflowWorker.js
// This worker offloads heavy computational tasks from the main thread

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  try {
    switch (type) {
      case 'calculateLayout':
        // Perform automatic layout calculation for complex workflows
        const layoutResult = calculateOptimalLayout(data.nodes, data.connections);
        self.postMessage({ type: 'layoutResult', data: layoutResult });
        break;
        
      case 'validateWorkflow':
        // Validate large workflows for errors, cycles, etc.
        const validationResult = validateWorkflow(data.nodes, data.connections);
        self.postMessage({ type: 'validationResult', data: validationResult });
        break;
        
      case 'exportWorkflow':
        // Format and prepare large workflows for export
        const exportResult = prepareExport(data.nodes, data.connections);
        self.postMessage({ type: 'exportResult', data: exportResult });
        break;
        
      case 'simulateExecution':
        // Simulate workflow execution for testing
        const simulationResult = simulateWorkflowExecution(data.nodes, data.connections, data.inputs);
        self.postMessage({ type: 'simulationResult', data: simulationResult });
        break;
        
      default:
        self.postMessage({ 
          type: 'error', 
          data: { message: `Unknown task type: ${type}` } 
        });
    }
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      data: { message: error.message, stack: error.stack } 
    });
  }
});

/**
 * Calculate optimal layout for nodes to minimize crossing connections
 * and improve readability
 */
function calculateOptimalLayout(nodes, connections) {
  // This would typically use a library like dagre or elkjs
  // For this example, we'll implement a simplified layered layout algorithm
  
  // Step 1: Assign layers to nodes (topological sort)
  const nodeLayers = assignLayers(nodes, connections);
  
  // Step 2: Order nodes within layers to minimize crossings
  const orderedLayers = minimizeCrossings(nodeLayers, connections);
  
  // Step 3: Calculate final positions
  const positions = {};
  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 150;
  
  orderedLayers.forEach((layer, layerIndex) => {
    const layerWidth = layer.length * HORIZONTAL_SPACING;
    const startX = -layerWidth / 2 + HORIZONTAL_SPACING / 2;
    
    layer.forEach((nodeId, nodeIndex) => {
      positions[nodeId] = {
        x: startX + nodeIndex * HORIZONTAL_SPACING,
        y: layerIndex * VERTICAL_SPACING
      };
    });
  });
  
  return positions;
}

/**
 * Assign layers to nodes based on their connections (topological sort)
 */
function assignLayers(nodes, connections) {
  // Create a map of node IDs to their outgoing connections
  const nodeOutgoing = {};
  const nodeIncoming = {};
  nodes.forEach(node => {
    nodeOutgoing[node.id] = [];
    nodeIncoming[node.id] = [];
  });
  
  connections.forEach(conn => {
    nodeOutgoing[conn.source].push(conn.target);
    nodeIncoming[conn.target].push(conn.source);
  });
  
  // Find nodes with no incoming connections (entry points)
  const entryNodes = nodes
    .filter(node => nodeIncoming[node.id].length === 0)
    .map(node => node.id);
  
  // Assign layers
  const layers = [];
  let currentLayer = entryNodes;
  const assignedNodes = new Set(entryNodes);
  
  // BFS to assign layers
  while (currentLayer.length > 0) {
    layers.push(currentLayer);
    
    const nextLayer = [];
    currentLayer.forEach(nodeId => {
      nodeOutgoing[nodeId].forEach(targetId => {
        // Check if all incoming nodes for this target are processed
        const canAssign = nodeIncoming[targetId].every(sourceId => 
          assignedNodes.has(sourceId)
        );
        
        if (canAssign && !assignedNodes.has(targetId)) {
          nextLayer.push(targetId);
          assignedNodes.add(targetId);
        }
      });
    });
    
    currentLayer = nextLayer;
  }
  
  // Handle cycles by assigning remaining nodes to appropriate layers
  if (assignedNodes.size < nodes.length) {
    const remainingNodes = nodes
      .filter(node => !assignedNodes.has(node.id))
      .map(node => node.id);
    
    // Assign remaining nodes to appropriate layers using a heuristic
    remainingNodes.forEach(nodeId => {
      const incomingLayers = nodeIncoming[nodeId]
        .filter(sourceId => assignedNodes.has(sourceId))
        .map(sourceId => {
          // Find the layer containing this source
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].includes(sourceId)) return i;
          }
          return -1;
        })
        .filter(layer => layer !== -1);
      
      const targetLayer = incomingLayers.length > 0 
        ? Math.max(...incomingLayers) + 1 
        : 0;
      
      // Ensure the layer exists
      while (layers.length <= targetLayer) {
        layers.push([]);
      }
      
      layers[targetLayer].push(nodeId);
      assignedNodes.add(nodeId);
    });
  }
  
  return layers;
}

/**
 * Reorder nodes within layers to minimize connection crossings
 */
function minimizeCrossings(layers, connections) {
  // Create a map of connections for quick lookup
  const connectionMap = {};
  connections.forEach(conn => {
    if (!connectionMap[conn.source]) connectionMap[conn.source] = [];
    connectionMap[conn.source].push(conn.target);
  });
  
  // Process each layer from top to bottom
  for (let i = 1; i < layers.length; i++) {
    const currentLayer = layers[i];
    const prevLayer = layers[i - 1];
    
    // Calculate the best order for the current layer based on connections
    layers[i] = reorderLayer(currentLayer, prevLayer, connectionMap);
  }
  
  return layers;
}

/**
 * Reorder a layer to minimize crossings with the previous layer
 */
function reorderLayer(layer, prevLayer, connectionMap) {
  // Compute the "barycenter" for each node in this layer
  const nodePositions = {};
  
  layer.forEach(nodeId => {
    // Find incoming connections from the previous layer
    const incomingFromPrev = [];
    
    prevLayer.forEach((prevNodeId, index) => {
      if (connectionMap[prevNodeId] && connectionMap[prevNodeId].includes(nodeId)) {
        incomingFromPrev.push(index);
      }
    });
    
    // Calculate barycenter (average position of incoming connections)
    if (incomingFromPrev.length > 0) {
      const sum = incomingFromPrev.reduce((a, b) => a + b, 0);
      nodePositions[nodeId] = sum / incomingFromPrev.length;
    } else {
      // If no incoming connections, position doesn't matter
      nodePositions[nodeId] = layer.indexOf(nodeId);
    }
  });
  
  // Sort the layer based on barycenter values
  return [...layer].sort((a, b) => nodePositions[a] - nodePositions[b]);
}

/**
 * Validate a workflow looking for common issues
 */
function validateWorkflow(nodes, connections) {
  const issues = [];
  
  // Check for orphaned nodes (no connections)
  nodes.forEach(node => {
    const hasConnections = connections.some(
      conn => conn.source === node.id || conn.target === node.id
    );
    
    if (!hasConnections) {
      issues.push({
        type: 'warning',
        nodeId: node.id,
        message: `Node "${node.title}" is not connected to any other nodes.`
      });
    }
  });
  
  // Check for missing input nodes (entry points)
  const hasEntryPoints = nodes.some(node => 
    !connections.some(conn => conn.target === node.id)
  );
  
  if (!hasEntryPoints) {
    issues.push({
      type: 'error',
      message: 'Workflow has no entry points. Add a node without incoming connections.'
    });
  }
  
  // Check for terminal nodes (end points)
  const hasExitPoints = nodes.some(node => 
    !connections.some(conn => conn.source === node.id)
  );
  
  if (!hasExitPoints) {
    issues.push({
      type: 'warning',
      message: 'Workflow has no exit points. Consider adding terminal nodes.'
    });
  }
  
  // Check for cycles (which might be intentional, so just warn)
  const cycles = detectCycles(nodes, connections);
  if (cycles.length > 0) {
    issues.push({
      type: 'warning',
      cycles,
      message: `Found ${cycles.length} cycles in the workflow.`
    });
  }
  
  return {
    valid: issues.filter(issue => issue.type === 'error').length === 0,
    issues
  };
}

/**
 * Detect cycles in the workflow graph using DFS
 */
function detectCycles(nodes, connections) {
  const cycles = [];
  
  // Create adjacency list
  const adjacencyList = {};
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });
  
  connections.forEach(conn => {
    adjacencyList[conn.source].push(conn.target);
  });
  
  // DFS to detect cycles
  nodes.forEach(node => {
    const visited = new Set();
    const path = [];
    dfs(node.id, visited, path);
  });
  
  function dfs(nodeId, visited, path) {
    // If we've already processed this node, skip
    if (visited.has(nodeId)) return;
    
    // If this node is already in our current path, we found a cycle
    const pathIndex = path.indexOf(nodeId);
    if (pathIndex !== -1) {
      // Extract the cycle
      const cycle = path.slice(pathIndex).concat(nodeId);
      cycles.push(cycle);
      return;
    }
    
    // Add this node to the current path
    path.push(nodeId);
    
    // Visit all neighbors
    adjacencyList[nodeId].forEach(neighbor => {
      dfs(neighbor, new Set([...visited]), [...path]);
    });
    
    // Mark this node as visited
    visited.add(nodeId);
  }
  
  return cycles;
}

/**
 * Prepare a workflow for export, optimizing large workflows
 */
function prepareExport(nodes, connections) {
  // Create a clean version of the workflow with only the necessary data
  const exportedNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    title: node.title,
    content: node.content,
    position: node.position
  }));
  
  const exportedConnections = connections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target
  }));
  
  // For large workflows, check if compression would be beneficial
  if (nodes.length > 100) {
    // Calculate the size reduction - this is just an example
    // In a real implementation, you might use actual compression
    const originalSize = JSON.stringify({nodes, connections}).length;
    const exportedSize = JSON.stringify({nodes: exportedNodes, connections: exportedConnections}).length;
    
    return {
      nodes: exportedNodes,
      connections: exportedConnections,
      stats: {
        nodeCount: nodes.length,
        connectionCount: connections.length,
        originalSize,
        exportedSize,
        reduction: originalSize - exportedSize
      }
    };
  }
  
  return {
    nodes: exportedNodes,
    connections: exportedConnections
  };
}

/**
 * Simulate workflow execution to validate it and provide feedback
 */
function simulateWorkflowExecution(nodes, connections, inputs = {}) {
  // Create adjacency list for the workflow graph
  const adjacencyList = {};
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });
  
  connections.forEach(conn => {
    adjacencyList[conn.source].push(conn.target);
  });
  
  // Find entry nodes (no incoming connections)
  const entryNodes = nodes.filter(node => 
    !connections.some(conn => conn.target === node.id)
  );
  
  if (entryNodes.length === 0) {
    return {
      success: false,
      error: "No entry points found in workflow"
    };
  }
  
  // Set up execution state
  const executionPath = [];
  const nodeStates = {};
  const executionResults = {};
  
  // Initialize node states
  nodes.forEach(node => {
    nodeStates[node.id] = {
      visited: false,
      executed: false,
      result: null,
      inputs: {}
    };
  });
  
  // Set initial inputs
  Object.keys(inputs).forEach(nodeId => {
    if (nodeStates[nodeId]) {
      nodeStates[nodeId].inputs = inputs[nodeId];
    }
  });
  
  // Run the simulation starting from entry nodes
  entryNodes.forEach(node => {
    executeNode(node.id);
  });
  
  function executeNode(nodeId) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    // Mark as visited
    nodeStates[nodeId].visited = true;
    executionPath.push(nodeId);
    
    // Simulate execution based on node type
    let result;
    switch (node.type) {
      case 'prompt':
        // Simulate prompt execution
        result = simulatePromptExecution(node, nodeStates[nodeId].inputs);
        break;
        
      case 'action':
        // Simulate action execution
        result = simulateActionExecution(node, nodeStates[nodeId].inputs);
        break;
        
      case 'condition':
        // Simulate condition evaluation
        result = simulateConditionEvaluation(node, nodeStates[nodeId].inputs);
        break;
        
      default:
        result = { error: `Unknown node type: ${node.type}` };
    }
    
    // Store the result
    nodeStates[nodeId].executed = true;
    nodeStates[nodeId].result = result;
    executionResults[nodeId] = result;
    
    // Follow connections
    adjacencyList[nodeId].forEach(targetId => {
      // Pass the result as input to the next node
      if (nodeStates[targetId]) {
        nodeStates[targetId].inputs[nodeId] = result;
      }
      
      // Check if all incoming connections to target have been executed
      const allInputsReady = connections
        .filter(conn => conn.target === targetId)
        .every(conn => nodeStates[conn.source] && nodeStates[conn.source].executed);
      
      if (allInputsReady) {
        executeNode(targetId);
      }
    });
    
    return result;
  }
  
  // Check if all nodes were executed
  const allNodesExecuted = nodes.every(node => nodeStates[node.id].executed);
  
  return {
    success: true,
    executionPath,
    results: executionResults,
    complete: allNodesExecuted,
    nodeStates
  };
}

/**
 * Simulate prompt execution
 */
function simulatePromptExecution(node, inputs) {
  // In a real implementation, you might have more complex simulation logic
  return {
    success: true,
    message: `Executed prompt: ${node.title}`,
    simulatedOutput: `This is a simulated output for the prompt: ${node.content}`
  };
}

/**
 * Simulate action execution
 */
function simulateActionExecution(node, inputs) {
  // Simple simulation - in a real implementation this would be more sophisticated
  return {
    success: true,
    message: `Executed action: ${node.title}`,
    simulatedOutputs: {
      processed: true,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Simulate condition evaluation
 */
function simulateConditionEvaluation(node, inputs) {
  // Simple random decision - in a real implementation this would 
  // actually evaluate the condition based on inputs
  const decision = Math.random() > 0.5;
  
  return {
    success: true,
    evaluation: decision,
    path: decision ? 'true' : 'false',
    message: `Evaluated condition: ${node.title} (${decision ? 'TRUE' : 'FALSE'})`
  };
}