// src/components/playground/FilesPanel.js
import React, { useRef } from 'react';
import { Paperclip, X, Plus, FileText } from 'lucide-react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

const FilesPanel = () => {
  const { 
    attachedFiles, 
    handleFileAttachment, 
    handleRemoveFile,
    toggleFileAsVariable,
    updateFileVariableName
  } = usePlaygroundState();
  
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-neutral-700">Attached Files</h3>
        <label className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600 cursor-pointer">
          <Paperclip size={14} />
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
        Files will be available to the model during processing. You can also use files as variables in your prompt.
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
        <EmptyFilesState fileInputRef={fileInputRef} />
      )}
      
      {attachedFiles.length > 0 && (
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Using Files in Prompts</h4>
          <div className="text-sm text-neutral-600">
            <p className="mb-2">Files can be used in two ways:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Automatically processed by the model when referenced</li>
              <li>Used as variables with the syntax: <code className="px-1 py-0.5 bg-neutral-100 rounded font-mono">{'{{'}file_variable_name{'}}'}</code></li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for empty files state
const EmptyFilesState = ({ fileInputRef }) => (
  <div className="p-6 text-center border border-dashed border-neutral-300 rounded-lg">
    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center">
      <Paperclip size={20} className="text-neutral-400" />
    </div>
    <p className="text-neutral-500 mb-2">No files attached</p>
    <label className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 cursor-pointer">
      <Plus size={14} />
      Browse Files
      <input 
        type="file" 
        multiple 
        onChange={(e) => fileInputRef.current?.files ? handleFileAttachment(e) : null} 
        className="hidden" 
      />
    </label>
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
          value={file.variableName}
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

export default FilesPanel;

