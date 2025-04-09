// src/hooks/usePromptLibrary.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export const usePromptLibrary = () => {
  const { promptDatabase } = useAppContext();
  
  // Local state management
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'alphabetical'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Calculate items per page based on view mode
  const itemsPerPage = viewMode === 'grid' ? 9 : 10;

  // Debounce search and apply filters
  useEffect(() => {
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      let filtered = [...promptDatabase];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(prompt => 
          prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (prompt.tags && prompt.tags.some(tag => 
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        );
      }
      
      // Apply category filters
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(prompt => 
          selectedCategories.includes(prompt.category)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (sortBy === 'recent') {
          // Default to timestamp or placeholder for recent comparison
          const dateA = a.usedAt || '1970-01-01';
          const dateB = b.usedAt || '1970-01-01';
          return sortDirection === 'desc' 
            ? dateB.localeCompare(dateA) 
            : dateA.localeCompare(dateB);
        } else if (sortBy === 'popular') {
          return sortDirection === 'desc'
            ? (b.usageCount || 0) - (a.usageCount || 0)
            : (a.usageCount || 0) - (b.usageCount || 0);
        } else if (sortBy === 'alphabetical') {
          return sortDirection === 'desc'
            ? b.text.localeCompare(a.text)
            : a.text.localeCompare(b.text);
        }
        return 0;
      });
      
      setFilteredPrompts(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [
    promptDatabase, 
    searchQuery, 
    selectedCategories, 
    sortBy, 
    sortDirection
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, sortBy, sortDirection]);

  // Toggle category selection
  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy('recent');
    setSortDirection('desc');
  }, []);

  // Toggle sort direction
  const toggleSortDirection = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  // Handle import button click
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Here you would handle the actual file processing
    // For demonstration purposes:
    console.log(`File "${file.name}" would be processed for import`);
    
    // Reset the file input
    e.target.value = '';
  }, []);

  // Export all prompts
  const handleExport = useCallback(() => {
    const dataToExport = JSON.stringify(filteredPrompts, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-library-export.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }, [filteredPrompts]);

  // Handle prompt selection for detailed view
  const handlePromptSelect = useCallback((prompt) => {
    setSelectedPrompt(prompt);
  }, []);

  // Handle drag and drop for file import
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDraggedOver(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDraggedOver(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json') {
        // Process file here
        console.log(`File "${file.name}" would be processed for import`);
      } else {
        alert('Please upload a JSON file');
      }
    }
  }, []);

  // Handle confirmation of prompt deletion
  const confirmDelete = useCallback(() => {
    // Here you would handle the actual deletion
    // For demonstration purposes:
    console.log(`Prompt "${promptToDelete?.text.substring(0, 20)}..." would be deleted`);
    
    setIsDeleteModalOpen(false);
    setPromptToDelete(null);
  }, [promptToDelete]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrompts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  
  const goToPage = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  return {
    // State
    searchQuery,
    setSearchQuery,
    filteredPrompts,
    selectedCategories,
    resetFilters,
    toggleCategory,
    isLoading,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortDirection,
    toggleSortDirection,
    selectedPrompt,
    setSelectedPrompt,
    handlePromptSelect,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    promptToDelete,
    setPromptToDelete,
    confirmDelete,
    currentPage,
    goToPage,
    itemsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems,
    fileInputRef,
    handleFileChange,
    handleImportClick,
    handleExport,
    isDraggedOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};