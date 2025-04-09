// src/components/promptLibrary/DeletePromptModal.js
import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../common/Button';

const DeletePromptModal = ({ prompt, onCancel, onConfirm }) => {
  if (!prompt) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 animate-fade-in">
        <div className="mb-4">
          <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800 text-center">Delete Prompt</h3>
          <p className="text-neutral-600 text-center mt-2">
            Are you sure you want to delete this prompt? This action cannot be undone.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletePromptModal;

