import React, { useState, useEffect } from 'react';
import { 
  Search, 
  GitBranch, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SortDesc,
  Star
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';

const WorkflowLibraryPage = () => {
  const { 
    workflows, 
    toggleFavoriteWorkflow, 
    favoriteWorkflows, 
    openWorkflow
  } = useAppContext();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'name'
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 6 : 10;

  // Debounce search
  useEffect(() => {
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      let filtered = [...workflows];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(workflow => 
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(workflow => 
          selectedCategories.includes(workflow.category)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (sortBy === 'recent') {
          // Assuming lastModified or similar field exists
          return new Date(b.lastUsed || '2025-01-01') - new Date(a.lastUsed || '2025-01-01');
        } else if (sortBy === 'popular') {
          return (b.usageCount || 0) - (a.usageCount || 0);
        } else if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
      
      setFilteredWorkflows(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, workflows, selectedCategories, sortBy]);

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
  };

  // Import workflow
  const importWorkflow = () => {
    // Would implement file upload dialog
    alert('Import workflow functionality would open a file selection dialog');
  };

  // Export all workflows
  const exportAllWorkflows = () => {
    // Would implement export functionality
    alert('Export all workflows functionality would be implemented here');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    // For demo purposes - parse relative dates like "2 days ago" or actual dates
    if (dateString.includes('ago') || dateString.includes('day') || dateString.includes('week')) {
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkflows.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-0 h-full bg-neutral-50 flex flex-col">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full flex flex-col">
        {/* Header with right-aligned buttons */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Workflow Library</h2>
              <p className="text-sm text-neutral-500 mt-1">Browse and manage your saved workflows</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                startIcon={<Upload size={18} />}
                onClick={importWorkflow}
              >
                Import
              </Button>
              
              <Button
                variant="outline"
                startIcon={<Download size={18} />}
                onClick={exportAllWorkflows}
              >
                Export
              </Button>
              
              <Button
                variant="primary"
                startIcon={<Plus size={18} />}
                onClick={() => openWorkflow(null)}
              >
                New Workflow
              </Button>
            </div>
          </div>
        </div>
        
        <div className="px-6 pt-6 pb-0 flex flex-col flex-grow">
          {/* Search and Filter Bar */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workflows..."
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
              
              {/* Sort By */}
              <div className="min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="recent">Recently Used</option>
                  <option value="popular">Most Popular</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden min-w-[120px]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    viewMode === 'grid'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap items-center mt-4 gap-2">
              <span className="text-sm text-neutral-500 mr-2">Categories:</span>
              {['marketing', 'writing', 'development', 'business'].map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedCategories.includes(category)
                      ? 'bg-primary-50 text-primary-600 border-primary-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
              
              {/* Reset Filters */}
              {(searchQuery || selectedCategories.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 ml-auto text-xs text-red-600 hover:bg-red-50 rounded-full flex items-center"
                >
                  <X size={14} className="mr-1" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Results Area */}
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-700">
                {isLoading ? 'Loading workflows...' : `${filteredWorkflows.length} Workflows`}
              </h3>
              
              {/* Pagination info */}
              {!isLoading && filteredWorkflows.length > 0 && (
                <div className="text-sm text-neutral-500">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredWorkflows.length)} of {filteredWorkflows.length}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-center py-12 flex-grow">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-2 text-neutral-500">Loading workflows...</p>
              </div>
            ) : filteredWorkflows.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 flex-grow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 mb-4">
                  <GitBranch size={28} />
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-2">No workflows found</h3>
                <p className="text-neutral-500 mb-4">
                  {workflows.length === 0 
                    ? "You haven't created any workflows yet." 
                    : "No results match your current filters."
                  }
                </p>
                {workflows.length === 0 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => openWorkflow(null)}
                    startIcon={<Plus size={18} />}
                  >
                    Create Workflow
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-grow">
                {currentItems.map(workflow => {
                  const isFavorite = favoriteWorkflows.some(f => f.id === workflow.id);
                  
                  return (
                    <Card key={workflow.id} className="flex flex-col hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-neutral-800 line-clamp-1">{workflow.name}</h4>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteWorkflow(workflow);
                          }}
                          className={`p-1 rounded-full ${isFavorite ? 'text-secondary-500' : 'text-neutral-300 hover:text-neutral-400'}`}
                          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                      </div>
                      
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2 flex-grow">
                        {workflow.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant={workflow.category} size="sm">
                          {workflow.category}
                        </Badge>
                        
                        <span className="text-xs text-neutral-500">
                          {workflow.lastUsed ? `Used: ${formatDate(workflow.lastUsed)}` : 'Never used'}
                        </span>
                      </div>
                      
                      <div className="flex mt-4 pt-4 border-t border-neutral-100">
                        <div className="text-xs text-neutral-500">
                          {workflow.steps?.length || 0} steps
                        </div>
                        
                        <div className="ml-auto">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openWorkflow(workflow)}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col flex-grow">
                <div className="flex flex-col flex-grow overflow-hidden">
                  <div className="overflow-y-auto w-full flex-grow">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-neutral-50 z-10">
                        <tr className="border-b border-neutral-200">
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Workflow</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-24">Steps</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-48">Last Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-20">Usage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {currentItems.map(workflow => {
                          const isFavorite = favoriteWorkflows.some(f => f.id === workflow.id);
                          
                          return (
                            <tr key={workflow.id} className="hover:bg-neutral-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start">
                                  <button 
                                    onClick={() => toggleFavoriteWorkflow(workflow)}
                                    className={`p-1 mr-2 rounded-full flex-shrink-0 ${isFavorite ? 'text-secondary-500' : 'text-neutral-300 hover:text-neutral-400'}`}
                                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                                  </button>
                                  <div>
                                    <p className="font-medium text-neutral-800 line-clamp-1">
                                      {workflow.name}
                                    </p>
                                    <p className="text-sm text-neutral-500 line-clamp-1 mt-1">
                                      {workflow.description}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={workflow.category} size="sm">
                                  {workflow.category}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {workflow.steps?.length || 0} steps
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {workflow.lastUsed ? formatDate(workflow.lastUsed) : 'Never used'}
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {workflow.usageCount || 0}
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => openWorkflow(workflow)}
                                  className="w-full justify-center"
                                >
                                  Open
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
                  Previous
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
        </div>
      </div>
    </div>
  );
};

export default WorkflowLibraryPage;