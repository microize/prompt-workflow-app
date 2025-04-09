import React, { useState, useRef } from 'react';
import { PlayCircle, Save, Download, Upload, Trash2, Code } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';

/**
 * Enhanced controls for the workflow editor that appear at the bottom of the workflow page
 */
const WorkflowControls = () => {
  const { nodes, connections, clearCanvas, exportWorkflow, importWorkflow } = useWorkflowContext();
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowCategory, setWorkflowCategory] = useState('');
  const fileInputRef = useRef(null);

  // Function to handle running the workflow
  const handleRunWorkflow = () => {
    if (nodes.length === 0) {
      alert('Please add nodes to your workflow before running it.');
      return;
    }
    
    if (connections.length === 0) {
      alert('Please connect your nodes before running the workflow.');
      return;
    }
    
    setIsRunning(true);
    
    // Simulate workflow execution with visual feedback
    const executeWorkflow = async () => {
      try {
        // Find entry points (nodes with no incoming connections)
        const entryNodes = nodes.filter(node => 
          !connections.some(conn => conn.target === node.id)
        );
        
        if (entryNodes.length === 0) {
          alert('Your workflow has no entry points. Please add a starting node.');
          setIsRunning(false);
          return;
        }
        
        // Highlight each node in sequence to simulate execution
        const nodeElements = document.querySelectorAll('[data-node-id]');
        
        // Create a function to follow the workflow path
        const processNode = async (nodeId, visited = new Set()) => {
          if (visited.has(nodeId)) return; // Prevent infinite loops
          visited.add(nodeId);
          
          // Find the node element
          const nodeElement = Array.from(nodeElements).find(
            el => el.getAttribute('data-node-id') === nodeId
          );
          
          if (nodeElement) {
            // Add a highlight class
            nodeElement.classList.add('bg-green-100');
            nodeElement.classList.add('border-green-400');
            
            // Wait a moment to simulate processing
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Remove highlight
            nodeElement.classList.remove('bg-green-100');
            nodeElement.classList.remove('border-green-400');
          }
          
          // Find outgoing connections
          const outgoingConnections = connections.filter(conn => conn.source === nodeId);
          
          // Follow each connection - process them in parallel
          await Promise.all(outgoingConnections.map(conn => 
            processNode(conn.target, new Set(visited))
          ));
        };
        
        // Execute each entry node as a starting point
        await Promise.all(entryNodes.map(node => processNode(node.id)));
        
        // Success message
        alert('Workflow execution completed successfully!');
      } catch (error) {
        console.error('Workflow execution error:', error);
        alert('Error during workflow execution: ' + error.message);
      } finally {
        setIsRunning(false);
      }
    };
    
    executeWorkflow();
  };

  // Function to handle saving the workflow
  const handleSaveWorkflow = () => {
    if (nodes.length === 0) {
      alert('Please add nodes to your workflow before saving.');
      return;
    }
    
    setShowSaveModal(true);
  };

  // Function to handle saving workflow after entering name/description
  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    setIsSaving(true);

    // Create workflow object to save
    const workflow = {
      id: Date.now(),
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory || 'general',
      nodes: nodes,
      connections: connections,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    // Simulate API call to save workflow
    setTimeout(() => {
      console.log('Saving workflow:', workflow);
      
      // In a real app, you would make an API call here
      try {
        localStorage.setItem(`workflow-${workflow.id}`, JSON.stringify(workflow));
        alert('Workflow saved successfully!');
      } catch (error) {
        console.error('Error saving workflow:', error);
        alert('Failed to save workflow. Please try again.');
      }
      
      setIsSaving(false);
      setShowSaveModal(false);
      setWorkflowName('');
      setWorkflowDescription('');
      setWorkflowCategory('');
    }, 800);
  };

  // Function to handle uploading a workflow JSON file
  const handleUploadWorkflow = () => {
    fileInputRef.current?.click();
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result;
        if (typeof jsonData === 'string') {
          if (importWorkflow(jsonData)) {
            alert('Workflow imported successfully!');
          }
        }
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Failed to import workflow: Invalid file format');
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };

  // Function to handle showing workflow as JSON
  const showWorkflowJson = () => {
    if (nodes.length === 0) {
      alert('No workflow to display');
      return;
    }

    const workflow = {
      nodes: nodes,
      connections: connections
    };

    // Create a modal to display the JSON
    const jsonModal = document.createElement('div');
    jsonModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg p-6 w-3/4 max-h-3/4 flex flex-col';
    
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-medium';
    title.innerText = 'Workflow JSON';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'p-1 rounded hover:bg-gray-200';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => document.body.removeChild(jsonModal);
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    const jsonContent = document.createElement('pre');
    jsonContent.className = 'bg-gray-100 p-4 rounded overflow-auto flex-1 text-sm';
    jsonContent.innerText = JSON.stringify(workflow, null, 2);
    
    const copyButton = document.createElement('button');
    copyButton.className = 'mt-4 px-4 py-2 bg-primary-500 text-white rounded';
    copyButton.innerText = 'Copy to Clipboard';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
      copyButton.innerText = 'Copied!';
      setTimeout(() => {
        copyButton.innerText = 'Copy to Clipboard';
      }, 2000);
    };
    
    modalContent.appendChild(header);
    modalContent.appendChild(jsonContent);
    modalContent.appendChild(copyButton);
    
    jsonModal.appendChild(modalContent);
    document.body.appendChild(jsonModal);
    
    jsonModal.onclick = (e) => {
      if (e.target === jsonModal) {
        document.body.removeChild(jsonModal);
      }
    };
  };

  return (
    <>
      <div className="p-3 border-t border-neutral-200 flex justify-between items-center bg-white">
        <div className="text-sm text-neutral-500">
          {nodes.length} nodes | {connections.length} connections
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={clearCanvas}
            className={`px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 flex items-center gap-1 transition-colors ${
              nodes.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
            }`}
            disabled={nodes.length === 0}
            title="Clear all nodes and connections"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear Canvas</span>
          </button>
          
          <button 
            onClick={showWorkflowJson}
            className={`px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 flex items-center gap-1 transition-colors ${
              nodes.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
            }`}
            disabled={nodes.length === 0}
            title="View workflow as JSON"
          >
            <Code size={16} />
            <span className="hidden sm:inline">View JSON</span>
          </button>
          
          <button 
            onClick={exportWorkflow}
            className={`px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 flex items-center gap-1 transition-colors ${
              nodes.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
            }`}
            disabled={nodes.length === 0}
            title="Export workflow as JSON file"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button 
            onClick={handleUploadWorkflow}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 flex items-center gap-1 hover:bg-neutral-50 transition-colors"
            title="Import workflow from JSON file"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>
          
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".json"
            className="hidden" 
            onChange={handleFileChange}
          />
          
          <button 
            onClick={handleSaveWorkflow}
            className={`px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors ${
              isSaving || nodes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSaving || nodes.length === 0}
            title="Save workflow to your library"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          
          <button 
            onClick={handleRunWorkflow}
            className={`px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors ${
              isRunning || nodes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning || nodes.length === 0}
            title="Execute the workflow"
          >
            <PlayCircle size={16} />
            <span>{isRunning ? 'Running...' : 'Run Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Save Workflow Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium mb-4">Save Workflow</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Workflow Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter workflow name"
                autoFocus
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={workflowCategory}
                onChange={(e) => setWorkflowCategory(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                <option value="development">Development</option>
                <option value="marketing">Marketing</option>
                <option value="writing">Writing</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="general">General</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter workflow description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveWorkflow}
                className={`px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center gap-1 transition-colors ${
                  isSaving || !workflowName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSaving || !workflowName.trim()}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Workflow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowControls;