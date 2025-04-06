import React, { useState } from 'react';
import { PlayCircle, Save, Download, Upload, Trash2, Share2 } from 'lucide-react';
import { useWorkflowContext } from '../../context/WorkflowContext';

/**
 * Controls for the workflow editor that appear at the bottom of the workflow page
 */
const WorkflowControls = () => {
  const { nodes, connections, clearCanvas } = useWorkflowContext();
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Function to handle running the workflow
  const handleRunWorkflow = () => {
    if (nodes.length === 0) return;
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      alert('Workflow execution completed!');
    }, 2000);
  };

  // Function to handle saving the workflow
  const handleSaveWorkflow = () => {
    if (nodes.length === 0) return;
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
      nodes: nodes,
      connections: connections,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    // Simulate API call to save workflow
    setTimeout(() => {
      console.log('Saving workflow:', workflow);
      setIsSaving(false);
      setShowSaveModal(false);
      setWorkflowName('');
      setWorkflowDescription('');
      alert('Workflow saved successfully!');
    }, 1000);
  };

  // Function to handle exporting the workflow as JSON
  const handleExportWorkflow = () => {
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
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 flex items-center gap-1"
            disabled={nodes.length === 0}
          >
            <Trash2 size={16} />
            Clear Canvas
          </button>
          
          <button 
            onClick={handleExportWorkflow}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 flex items-center gap-1"
            disabled={nodes.length === 0}
          >
            <Download size={16} />
            Export
          </button>
          
          <button 
            onClick={handleSaveWorkflow}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
            disabled={isSaving || nodes.length === 0}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Workflow'}
          </button>
          
          <button 
            onClick={handleRunWorkflow}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
            disabled={isRunning || nodes.length === 0}
          >
            <PlayCircle size={16} />
            {isRunning ? 'Running...' : 'Run Workflow'}
          </button>
        </div>
      </div>

      {/* Save Workflow Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Save Workflow</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter workflow name"
              />
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
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={saveWorkflow}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center gap-1"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowControls;