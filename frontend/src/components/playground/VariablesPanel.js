// src/components/playground/VariablesPanel.js
import React from 'react';
import { Plus, X, Code, BracketsIcon } from 'lucide-react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';

// Custom BracketsIcon if not available in Lucide
const CustomBracketsIcon = ({ size = 16, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 8L3 12L7 16"></path>
    <path d="M17 8L21 12L17 16"></path>
  </svg>
);

const VariablesPanel = () => {
  const { 
    variables, 
    newVariable, 
    isAddingVariable,
    setIsAddingVariable,
    setNewVariable,
    handleAddVariable,
    handleDeleteVariable,
    previewWithVariables
  } = usePlaygroundState();

  // Using either the imported icon or our custom one
  const VariableIcon = typeof BracketsIcon !== 'undefined' ? BracketsIcon : CustomBracketsIcon;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-neutral-700 flex items-center gap-2">
          <VariableIcon size={18} className="text-primary-500" />
          Prompt Variables
        </h3>
        <button 
          onClick={() => setIsAddingVariable(true)}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          <Plus size={14} />
          Add Variable
        </button>
      </div>
      
      <p className="text-sm text-neutral-500">
        Add variables to your prompt using the format: &#123;&#123;variable_name&#125;&#125;
      </p>
      
      {isAddingVariable && <AddVariableForm 
        newVariable={newVariable}
        setNewVariable={setNewVariable}
        handleAddVariable={handleAddVariable}
        setIsAddingVariable={setIsAddingVariable}
      />}
      
      {variables.length > 0 ? (
        <VariablesTable 
          variables={variables} 
          handleDeleteVariable={handleDeleteVariable} 
        />
      ) : (
        <div className="p-6 text-center border border-dashed border-neutral-300 rounded-lg">
          <p className="text-neutral-500">No variables added yet</p>
        </div>
      )}
      
      {variables.length > 0 && (
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Preview with Variables</h4>
          <div className="p-3 bg-white rounded border border-neutral-200 text-sm whitespace-pre-line">
            {previewWithVariables()}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for adding new variables
const AddVariableForm = ({ newVariable, setNewVariable, handleAddVariable, setIsAddingVariable }) => (
  <div className="p-3 border border-neutral-200 rounded-lg bg-neutral-50">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1">
          Variable Name
        </label>
        <input 
          type="text" 
          value={newVariable.name}
          onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
          placeholder="e.g. customer_name"
          className="w-full p-2 text-sm border border-neutral-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1">
          Value
        </label>
        <input 
          type="text" 
          value={newVariable.value}
          onChange={(e) => setNewVariable({...newVariable, value: e.target.value})}
          placeholder="e.g. John Doe"
          className="w-full p-2 text-sm border border-neutral-300 rounded-md"
        />
      </div>
    </div>
    
    <div className="mb-3">
      <label className="block text-xs font-medium text-neutral-600 mb-1">
        Description (optional)
      </label>
      <input 
        type="text" 
        value={newVariable.description}
        onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
        placeholder="e.g. Customer's full name"
        className="w-full p-2 text-sm border border-neutral-300 rounded-md"
      />
    </div>
    
    <div className="flex justify-end gap-2">
      <button 
        onClick={() => setIsAddingVariable(false)}
        className="px-3 py-1 text-xs text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-100"
      >
        Cancel
      </button>
      <button 
        onClick={handleAddVariable}
        className="px-3 py-1 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600"
      >
        Add
      </button>
    </div>
  </div>
);

// Helper component for variables table
const VariablesTable = ({ variables, handleDeleteVariable }) => (
  <div className="border border-neutral-200 rounded-lg overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-neutral-50">
        <tr className="border-b border-neutral-200">
          <th className="px-4 py-2 text-left font-medium text-neutral-600">Name</th>
          <th className="px-4 py-2 text-left font-medium text-neutral-600">Value</th>
          <th className="px-4 py-2 text-left font-medium text-neutral-600">Description</th>
          <th className="px-4 py-2 text-right font-medium text-neutral-600">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200">
        {variables.map(variable => (
          <tr key={variable.id}>
            <td className="px-4 py-3 font-mono">{variable.name}</td>
            <td className="px-4 py-3">{variable.value}</td>
            <td className="px-4 py-3 text-neutral-500">{variable.description}</td>
            <td className="px-4 py-3 text-right">
              <button 
                onClick={() => handleDeleteVariable(variable.id)}
                className="p-1 text-neutral-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default VariablesPanel;