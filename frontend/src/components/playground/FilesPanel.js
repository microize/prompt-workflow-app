// src/components/playground/FilesPanel.js
import React, { useRef, useEffect } from 'react';
import { Paperclip, X, Plus, FileText, Code } from 'lucide-react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

const FilesPanel = () => {
  const { 
    attachedFiles, 
    handleFileAttachment, 
    handleRemoveFile,
    toggleFileAsVariable,
    updateFileVariableName,
    variables,
    handleAddVariable
  } = usePlaygroundState();
  
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  // Automatically create a variable when a file is added
  useEffect(() => {
    // Find files that are not used as variables yet
    const unassignedFiles = attachedFiles.filter(file => !file.usedAsVariable);
    
    // For each unassigned file, toggle it to be used as a variable
    unassignedFiles.forEach(file => {
      toggleFileAsVariable(file.id);
      
      // Create a corresponding variable if it doesn't exist
      const variableName = file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase();
      const filePathValue = `[FILE: ${file.name}]`;
      
      // Check if variable already exists
      const existingVariable = variables.find(v => v.name === variableName);
      if (!existingVariable) {
        // Create a new variable object for this file
        const newVar = {
          name: variableName,
          value: filePathValue,
          description: `Variable for file: ${file.name}`
        };
        
        // Add the variable
        handleAddVariable(newVar);
      }
    });
  }, [attachedFiles, toggleFileAsVariable, variables, handleAddVariable]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-neutral-700 flex items-center gap-2">
          <Paperclip size={18} className="text-primary-500" />
          Attached Files
        </h3>
        <label className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600 cursor-pointer">
          <Plus size={14} />
          Attach File
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            onChange={handleFileAttachment} 
            className="hidden" 
          />
        </label>
      </div>
      
      <p className="text-sm text-neutral-500">
        Files will be automatically assigned to variables for use in your prompt.
      </p>
      
      {attachedFiles.length > 0 ? (
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="p-3 bg-neutral-50 border-b border-neutral-200 text-sm font-medium text-neutral-700">
            {attachedFiles.length} File{attachedFiles.length !== 1 ? 's' : ''} Attached
          </div>
          <ul className="divide-y divide-neutral-200">
            {attachedFiles.map(file => (
              <FileListItem 
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
                onToggleVariable={toggleFileAsVariable}
                onUpdateVariableName={updateFileVariableName}
              />
            ))}
          </ul>
        </div>
      ) : (
        <EmptyFilesState onClick={handleUpload} />
      )}
      
      {attachedFiles.length > 0 && (
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
            <Code size={14} className="text-primary-500" />
            Using Files in Prompts
          </h4>
          <div className="text-sm text-neutral-600">
            <p className="mb-2">Your files are now available as variables with this syntax:</p>
            <ul className="list-disc pl-5 space-y-1">
              {attachedFiles.map(file => (
                <li key={file.id}>
                  <code className="px-1 py-0.5 bg-neutral-100 rounded font-mono">
                    {`{{${file.variableName || file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase()}}}`}
                  </code>
                  <span className="text-neutral-500 ml-2">{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for empty files state
const EmptyFilesState = ({ onClick }) => (
  <div className="p-6 text-center border border-dashed border-neutral-300 rounded-lg">
    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center">
      <Paperclip size={20} className="text-neutral-400" />
    </div>
    <p className="text-neutral-500 mb-2">No files attached</p>
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 cursor-pointer"
    >
      <Plus size={14} />
      Browse Files
    </button>
  </div>
);

// Helper component for file list items
const FileListItem = ({ file, onRemove, onToggleVariable, onUpdateVariableName }) => (
  <li className="flex items-center justify-between p-3">
    <div className="flex items-center gap-3">
      <FileText size={16} className="text-neutral-400" />
      <div>
        <div className="text-neutral-800">{file.name}</div>
        <div className="text-xs text-neutral-500">
          {(file.size / 1024).toFixed(1)} KB
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <input 
          type="checkbox" 
          id={`use-as-var-${file.id}`}
          checked={file.usedAsVariable}
          onChange={() => onToggleVariable(file.id)}
          className="mr-2"
        />
        <label htmlFor={`use-as-var-${file.id}`} className="text-sm">Use as variable</label>
      </div>
      
      {file.usedAsVariable && (
        <input
          type="text"
          value={file.variableName || file.name.split('.')[0].replace(/\s+/g, '_').toLowerCase()}
          onChange={(e) => onUpdateVariableName(file.id, e.target.value)}
          placeholder="Variable name"
          className="w-32 px-2 py-1 text-xs border border-neutral-300 rounded"
        />
      )}
      
      <button 
        onClick={() => onRemove(file.id)}
        className="p-1 text-neutral-400 hover:text-red-500"
      >
        <X size={16} />
      </button>
    </div>
  </li>
);

// Ensure the component is exported as default
export default FilesPanel;