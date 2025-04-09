// frontend/src/services/api.js

const API_URL = 'http://localhost:8000/api';

// Prompt API calls
export const fetchPrompts = async () => {
  const response = await fetch(`${API_URL}/prompts/`);
  if (!response.ok) throw new Error('Failed to fetch prompts');
  return response.json();
};

export const fetchPrompt = async (id) => {
  const response = await fetch(`${API_URL}/prompts/${id}/`);
  if (!response.ok) throw new Error('Failed to fetch prompt');
  return response.json();
};

export const createPrompt = async (promptData) => {
  const response = await fetch(`${API_URL}/prompts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });
  if (!response.ok) throw new Error('Failed to create prompt');
  return response.json();
};

export const updatePrompt = async (id, promptData) => {
  const response = await fetch(`${API_URL}/prompts/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });
  if (!response.ok) throw new Error('Failed to update prompt');
  return response.json();
};

export const deletePrompt = async (id) => {
  const response = await fetch(`${API_URL}/prompts/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete prompt');
  return true;
};

export const togglePromptFavorite = async (id) => {
  const response = await fetch(`${API_URL}/prompts/${id}/toggle_favorite/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to toggle favorite');
  return response.json();
};

export const incrementPromptUsage = async (id) => {
  const response = await fetch(`${API_URL}/prompts/${id}/increment_usage/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to increment usage');
  return response.json();
};

export const fetchFavoritePrompts = async () => {
  const response = await fetch(`${API_URL}/prompts/favorites/`);
  if (!response.ok) throw new Error('Failed to fetch favorite prompts');
  return response.json();
};

export const fetchRecentPrompts = async () => {
  const response = await fetch(`${API_URL}/prompts/recent/`);
  if (!response.ok) throw new Error('Failed to fetch recent prompts');
  return response.json();
};

export const fetchPopularPrompts = async () => {
  const response = await fetch(`${API_URL}/prompts/popular/`);
  if (!response.ok) throw new Error('Failed to fetch popular prompts');
  return response.json();
};

// Workflow API calls
export const fetchWorkflows = async () => {
  const response = await fetch(`${API_URL}/workflows/`);
  if (!response.ok) throw new Error('Failed to fetch workflows');
  return response.json();
};

export const fetchWorkflow = async (id) => {
  const response = await fetch(`${API_URL}/workflows/${id}/`);
  if (!response.ok) throw new Error('Failed to fetch workflow');
  return response.json();
};

export const createWorkflow = async (workflowData) => {
  const response = await fetch(`${API_URL}/workflows/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  });
  if (!response.ok) throw new Error('Failed to create workflow');
  return response.json();
};

export const updateWorkflow = async (id, workflowData) => {
  const response = await fetch(`${API_URL}/workflows/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  });
  if (!response.ok) throw new Error('Failed to update workflow');
  return response.json();
};

export const deleteWorkflow = async (id) => {
  const response = await fetch(`${API_URL}/workflows/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete workflow');
  return true;
};

export const toggleWorkflowFavorite = async (id) => {
  const response = await fetch(`${API_URL}/workflows/${id}/toggle_favorite/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to toggle favorite for workflow');
  return response.json();
};

export const incrementWorkflowUsage = async (id) => {
  const response = await fetch(`${API_URL}/workflows/${id}/increment_usage/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to increment workflow usage');
  return response.json();
};

export const fetchFavoriteWorkflows = async () => {
  const response = await fetch(`${API_URL}/workflows/favorites/`);
  if (!response.ok) throw new Error('Failed to fetch favorite workflows');
  return response.json();
};

export const fetchRecentWorkflows = async () => {
  const response = await fetch(`${API_URL}/workflows/recent/`);
  if (!response.ok) throw new Error('Failed to fetch recent workflows');
  return response.json();
};

export const fetchPopularWorkflows = async () => {
  const response = await fetch(`${API_URL}/workflows/popular/`);
  if (!response.ok) throw new Error('Failed to fetch popular workflows');
  return response.json();
};