import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Tag, 
  Download, 
  Upload, 
  X,
  Check,
  SortAsc,
  SortDesc,
  Star,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Grid,
  List,
  Info,
  Clock,
  Eye
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const PromptLibraryPage = () => {
  const { 
    promptDatabase, 
    toggleFavorite, 
    favorites,
    openPlayground,
    activeFilters,
    handleFilterClick
  } = useAppContext();

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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const itemsPerPage = viewMode === 'grid' ? 9 : 10;
  const fileInputRef = useRef(null);

  // Debounce search
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
      
      // Apply category filters from main filters
      const activeFiltersList = Object.entries(activeFilters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeFiltersList.length > 0) {
        filtered = filtered.filter(prompt => 
          activeFiltersList.includes(prompt.category)
        );
      }
      
      // Apply selected categories
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
    activeFilters, 
    selectedCategories, 
    sortBy, 
    sortDirection
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, sortBy, sortDirection]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    
    // Reset main category filters by simulating clicks on active ones
    Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .forEach(([key]) => handleFilterClick(key));
      
    setSortBy('recent');
    setSortDirection('desc');
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Handle import button click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Here you would handle the actual file processing
    // For demonstration purposes:
    alert(`File "${file.name}" would be processed for import`);
    
    // Reset the file input
    e.target.value = '';
  };

  // Export all prompts
  const handleExport = () => {
    const dataToExport = JSON.stringify(filteredPrompts, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-library-export.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  // Handle prompt selection for detailed view
  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
  };

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
        alert(`File "${file.name}" would be processed for import`);
      } else {
        alert('Please upload a JSON file');
      }
    }
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrompts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Never used') return 'Never used';
    
    // For demo purposes - parse relative dates or actual dates
    if (dateString.includes('ago') || dateString.includes('day') || 
        dateString.includes('week') || dateString.includes('month')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Handle confirmation of prompt deletion
  const confirmDelete = () => {
    // Here you would handle the actual deletion
    // For demonstration purposes:
    alert(`Prompt "${promptToDelete?.text.substring(0, 20)}..." would be deleted`);
    
    setIsDeleteModalOpen(false);
    setPromptToDelete(null);
  };

  // Close the details panel
  const closeDetails = () => {
    setSelectedPrompt(null);
  };

  return (
    <div 
      className={`p-0 h-full bg-neutral-50 flex flex-col ${isDraggedOver ? 'bg-primary-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full flex flex-col">
        {/* Header with action buttons */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Prompt Library</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'} available in your library
              </p>
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
                onClick={handleImportClick}
              >
                Import
              </Button>
              
              <Button
                variant="outline"
                startIcon={<Download size={18} />}
                onClick={handleExport}
                disabled={filteredPrompts.length === 0}
              >
                Export
              </Button>
              
              <Button
                variant="primary"
                startIcon={<Plus size={18} />}
                onClick={() => openPlayground(null)}
              >
                New Prompt
              </Button>
            </div>
          </div>
        </div>
        
        <div className="px-6 pt-6 pb-0 flex flex-col flex-grow">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by prompt text or tags..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* View Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Control */}
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden min-w-[180px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="py-2 pl-3 pr-8 border-0 bg-white text-sm focus:ring-0"
                  >
                    <option value="recent">Recently Used</option>
                    <option value="popular">Most Popular</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                  <button
                    onClick={toggleSortDirection}
                    className="p-2 border-l border-neutral-200 bg-white"
                    title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  >
                    {sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  </button>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center justify-center px-3 py-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                    title="Grid View"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center justify-center px-3 py-2 ${
                      viewMode === 'list'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
                
                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                  className={`flex items-center gap-1 px-3 py-2 border rounded-lg transition-colors ${
                    isFilterDrawerOpen || selectedCategories.length > 0
                      ? 'bg-primary-50 text-primary-600 border-primary-200'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Filter size={16} />
                  <span className="text-sm">Filter</span>
                  {selectedCategories.length > 0 && (
                    <span className="ml-1 w-5 h-5 bg-primary-100 text-primary-700 rounded-full text-xs flex items-center justify-center">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Category Filters - Only show when filter drawer is open */}
            {isFilterDrawerOpen && (
              <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-lg animate-fade-in">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-neutral-700">Categories:</span>
                  {['web', 'design', 'writing', 'marketing', 'business', 'development'].map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-primary-50 text-primary-600 border border-primary-200'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-neutral-500">
                    {selectedCategories.length > 0 
                      ? `${selectedCategories.length} category filters applied` 
                      : 'No category filters applied'}
                  </div>
                  
                  {/* Reset Filters */}
                  {(searchQuery || selectedCategories.length > 0) && (
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center transition-colors"
                    >
                      <X size={14} className="mr-1" />
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="flex flex-grow">
            {/* Main Content */}
            <div className={`flex flex-col flex-grow transition-all duration-300 ${
              selectedPrompt ? 'md:pr-4' : ''
            }`}>
              {/* Results Display */}
              {isLoading ? (
                <div className="text-center py-12 flex-grow flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-neutral-600">Loading prompts...</p>
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 flex-grow flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">No prompts found</h3>
                  <p className="text-neutral-500 mb-6 max-w-md">
                    {promptDatabase.length === 0 
                      ? "Your prompt library is empty. Create your first prompt to get started." 
                      : "No results match your current search or filters. Try adjusting your criteria."}
                  </p>
                  
                  {promptDatabase.length === 0 ? (
                    <Button 
                      variant="primary" 
                      onClick={() => openPlayground(null)}
                      startIcon={<Plus size={18} />}
                    >
                      Create Prompt
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-grow">
                  {currentItems.map(prompt => {
                    const isFavorite = favorites.some(f => f.id === prompt.id);
                    
                    return (
                      <Card 
                        key={prompt.id} 
                        className={`flex flex-col hover:shadow-md transition-shadow ${
                          selectedPrompt?.id === prompt.id ? 'ring-2 ring-primary-500' : ''
                        }`}
                        onClick={() => handlePromptSelect(prompt)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-grow">
                            <p className="font-medium text-neutral-800 line-clamp-2">{prompt.text}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(prompt);
                            }}
                            className={`p-1 rounded-full flex-shrink-0 ${isFavorite ? 'text-secondary-500' : 'text-neutral-300 hover:text-neutral-400'}`}
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                          </button>
                        </div>
                        
                        <div className="mt-2 mb-4 flex-grow">
                          {prompt.tags && prompt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prompt.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {prompt.tags.length > 3 && (
                                <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                  +{prompt.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-auto pt-3 border-t border-neutral-100">
                          <Badge variant={prompt.category} size="sm">
                            {prompt.category}
                          </Badge>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-xs text-neutral-500">
                              <Clock size={12} className="mr-1" />
                              {prompt.usedAt ? formatDate(prompt.usedAt) : 'Never used'}
                            </div>
                            
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPlayground(prompt);
                              }}
                              className="prompt-try-button"
                              title="Use this prompt in the playground"
                            >
                              Use
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                // List View
                <div className="overflow-hidden rounded-lg border border-neutral-200 flex-grow flex flex-col">
                  <div className="overflow-y-auto w-full h-full">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-neutral-50 z-10">
                        <tr className="border-b border-neutral-200">
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prompt</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-20">Usage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-48">Last Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {currentItems.map(prompt => {
                          const isFavorite = favorites.some(f => f.id === prompt.id);
                          
                          return (
                            <tr 
                              key={prompt.id} 
                              className={`hover:bg-neutral-50 transition-colors cursor-pointer ${
                                selectedPrompt?.id === prompt.id ? 'bg-primary-50' : ''
                              }`}
                              onClick={() => handlePromptSelect(prompt)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-start">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(prompt);
                                    }}
                                    className={`p-1 mr-2 rounded-full flex-shrink-0 ${isFavorite ? 'text-secondary-500' : 'text-neutral-300 hover:text-neutral-400'}`}
                                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                                  </button>
                                  <div>
                                    <p className="font-medium text-neutral-800 line-clamp-2">
                                      {prompt.text}
                                    </p>
                                    {prompt.tags && prompt.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {prompt.tags.slice(0, 2).map(tag => (
                                          <span key={tag} className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                            {tag}
                                          </span>
                                        ))}
                                        {prompt.tags.length > 2 && (
                                          <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                            +{prompt.tags.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={prompt.category} size="sm">
                                  {prompt.category}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {prompt.usageCount || 0}
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {prompt.usedAt ? formatDate(prompt.usedAt) : 'Never used'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openPlayground(prompt);
                                    }}
                                    className="prompt-try-button"
                                    title="Use this prompt in the playground"
                                  >
                                    Use
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    startIcon={<ChevronLeft size={16} />}
                  >
                    Prev
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate page numbers to show based on current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                            currentPage === pageNum
                              ? 'bg-primary-500 text-white'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-neutral-400">...</span>
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-sm bg-white text-neutral-700 hover:bg-neutral-100"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    endIcon={<ChevronRight size={16} />}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              )}
            </div>
            
            {/* Details Panel - Slide in from right when a prompt is selected */}
            {selectedPrompt && (
              <div className="hidden md:block w-80 ml-4 border border-neutral-200 bg-white rounded-lg shadow-sm overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
                  <h3 className="font-medium text-neutral-700">Prompt Details</h3>
                  <button 
                    onClick={closeDetails}
                    className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="p-4 max-h-[calc(100vh-240px)] overflow-y-auto">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Prompt Text</h4>
                    <p className="text-neutral-800 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      {selectedPrompt.text}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Category</h4>
                      <Badge variant={selectedPrompt.category} className="w-full flex justify-center py-1">
                        {selectedPrompt.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Usage Count</h4>
                      <div className="flex items-center justify-center gap-1 bg-neutral-50 rounded-lg border border-neutral-200 p-2">
                        <Star size={14} className="text-secondary-500" />
                        <span>{selectedPrompt.usageCount || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPrompt.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Last Used</h4>
                    <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                      <Clock size={14} className="text-neutral-500" />
                      <span className="text-sm">{selectedPrompt.usedAt ? formatDate(selectedPrompt.usedAt) : 'Never used'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="primary"
                        onClick={() => openPlayground(selectedPrompt)}
                        className="w-full"
                      >
                        Use in Playground
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedPrompt.text);
                            // Show toast or feedback
                          }}
                          startIcon={<Copy size={14} />}
                        >
                          Copy
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPromptToDelete(selectedPrompt);
                            setIsDeleteModalOpen(true);
                          }}
                          startIcon={<Trash2 size={14} />}
                          className="text-red-600 hover:bg-red-50 hover:border-red-200"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* File Upload Drag Area Overlay - Only visible when dragging files */}
      {isDraggedOver && (
        <div className="absolute inset-0 bg-primary-50 bg-opacity-90 z-50 flex items-center justify-center border-2 border-dashed border-primary-300 rounded-lg">
          <div className="text-center p-8">
            <Upload size={48} className="mx-auto mb-4 text-primary-500" />
            <h3 className="text-xl font-medium text-primary-700 mb-2">Drop to Import Prompts</h3>
            <p className="text-primary-600">Release to upload your JSON file</p>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
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
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPromptToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptLibraryPage;