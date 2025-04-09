// src/components/promptLibrary/LibraryHeader.js
import React from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import Button from '../common/Button';

const LibraryHeader = ({ onImport, onExport, onNewPrompt, fileInputRef, handleFileChange }) => {
  return (
    <div className="p-6 border-b border-neutral-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Prompt Library</h2>
          <p className="text-sm text-neutral-500 mt-1">Browse and manage your saved prompts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".json"
            className="hidden" 
            onChange={handleFileChange}
          />
          
          <Button
            variant="outline"
            startIcon={<Upload size={18} />}
            onClick={onImport}
          >
            Import
          </Button>
          
          <Button
            variant="outline"
            startIcon={<Download size={18} />}
            onClick={onExport}
          >
            Export
          </Button>
          
          <Button
            variant="primary"
            startIcon={<Plus size={18} />}
            onClick={onNewPrompt}
          >
            New Prompt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LibraryHeader;