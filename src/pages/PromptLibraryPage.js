import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const PromptLibraryPage = () => {
  const { 
    promptDatabase, 
    toggleFavorite, 
    favorites,
    openPlayground,
    activeFilters,
    handleFilterClick
  } = useAppContext();

  // Local state for the prompt library page
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customFilters, setCustomFilters] = useState([
    { id: 'business', label: 'Business', active: false },
    { id: 'development', label: 'Development', active: false }
  ]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'alphabetical'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 15;

  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Apply filtering and sorting when dependencies change
  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Simulating an API call delay
    const timeoutId = setTimeout(() => {
      let filtered = [...promptDatabase];
      
      // Text search filter
      if (debouncedSearchQuery) {
        filtered = filtered.filter(prompt => 
          prompt.text.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }
      
      // Category filters from main filters
      const activeFiltersList = Object.entries(activeFilters)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      
      if (activeFiltersList.length > 0) {
        filtered = filtered.filter(prompt => 
          activeFiltersList.includes(prompt.category)
        );
      }
      
      // Custom filters (tags)
      const activeCustomFilters = customFilters
        .filter(filter => filter.active)
        .map(filter => filter.id);
      
      if (activeCustomFilters.length > 0) {
        filtered = filtered.filter(prompt => 
          activeCustomFilters.includes(prompt.category)
        );
      }
      
      // Selected individual tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(prompt => {
          // Assuming each prompt might have optional tags array
          const promptTags = prompt.tags || [];
          return selectedTags.some(tag => promptTags.includes(tag));
        });
      }
      
      // Sorting
      filtered.sort((a, b) => {
        if (sortBy === 'recent') {
          // Assuming prompt has usedAt or timestamp field
          const dateA = a.usedAt || '';
          const dateB = b.usedAt || '';
          return sortDirection === 'desc' 
            ? dateB.localeCompare(dateA) 
            : dateA.localeCompare(dateB);
        } else if (sortBy === 'popular') {
          // Sort by usage count
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
    debouncedSearchQuery, 
    activeFilters, 
    customFilters,
    selectedTags,
    sortBy,
    sortDirection
  ]);

  // Toggle custom filter
  const toggleCustomFilter = (filterId) => {
    setCustomFilters(prevFilters => 
      prevFilters.map(filter => 
        filter.id === filterId 
          ? { ...filter, active: !filter.active } 
          : filter
      )
    );
  };

  // Add a new custom tag/filter
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    // Create a unique ID from the name
    const newId = newTagName.toLowerCase().replace(/\s+/g, '_');
    
    // Check if this tag already exists
    if (customFilters.some(filter => filter.id === newId)) {
      alert('This tag already exists');
      return;
    }
    
    setCustomFilters(prev => [
      ...prev, 
      { id: newId, label: newTagName, active: false }
    ]);
    
    setNewTagName('');
    setShowTagInput(false);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Toggle a tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle pagination
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = filteredPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const clearAllFilters = () => {
    setSearchQuery('');
    setCustomFilters(prev => prev.map(f => ({ ...f, active: false })));
    setSelectedTags([]);
    // Reset main category filters by simulating clicks on active ones
    Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .forEach(([key]) => handleFilterClick(key));
  };

  return (
    <div className="p-0 h-full bg-neutral-50">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full">
        {/* Header - Removed gap between heading and content */}
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold">Prompt Library</h2>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              startIcon={<Upload size={18} />}
            >
              Import
            </Button>
            
            <Button
              variant="outline"
              startIcon={<Download size={18} />}
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
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg shadow-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-neutral-700 font-medium">Filter:</h3>
              
              {/* Standard category filters */}
              {['web', 'design', 'writing', 'marketing'].map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilters[category] 
                      ? 'bg-primary-50 text-primary-600 border border-primary-200' 
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
                  }`}
                  aria-pressed={activeFilters[category]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
              
              {/* Custom filters/tags */}
              {customFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleCustomFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter.active 
                      ? 'bg-primary-50 text-primary-600 border border-primary-200' 
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200'
                  }`}
                  aria-pressed={filter.active}
                >
                  {filter.label}
                </button>
              ))}
              
              {/* Add new tag button */}
              {showTagInput ? (
                <div className="flex items-center border border-neutral-300 rounded-full overflow-hidden">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Filter name..."
                    className="px-3 py-1 border-none focus:outline-none text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag();
                      if (e.key === 'Escape') setShowTagInput(false);
                    }}
                  />
                  <button 
                    onClick={handleAddTag}
                    className="p-2 bg-primary-500 text-white hover:bg-primary-600"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => setShowTagInput(false)}
                    className="p-2 bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <Plus size={14} />
                  Add Filter
                </button>
              )}
              
              {/* Advanced Filter Toggle */}
              <button
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-colors ${
                  isAdvancedFilterOpen
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Filter size={14} />
                Tags
                {isAdvancedFilterOpen ? " ×" : ""}
              </button>
              
              {/* Clear Filters button */}
              {(searchQuery || selectedTags.length > 0 || 
                Object.values(activeFilters).some(Boolean) || 
                customFilters.some(f => f.active)) && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}
            </div>
            
            {/* Sorting Controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 border border-neutral-200 rounded-lg text-sm bg-white"
              >
                <option value="recent">Recently Used</option>
                <option value="popular">Most Popular</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              
              <button
                onClick={toggleSortDirection}
                className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
              </button>
            </div>
          </div>
          
          {/* Advanced Filter Panel - conditionally rendered */}
          {isAdvancedFilterOpen && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-neutral-200">
              <h4 className="font-medium mb-3 text-neutral-700">Filter by Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['AI', 'Marketing', 'SEO', 'Email', 'Creative', 'Technical', 'Mobile', 'Web Design', 'Content', 'Strategy', 'UX'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    <Tag size={12} />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-neutral-700">
              {isLoading ? 'Loading prompts...' : `${filteredPrompts.length} Prompts Found`}
            </h2>
            
            {/* Pagination info */}
            {!isLoading && filteredPrompts.length > 0 && (
              <div className="text-sm text-neutral-500">
                Showing {indexOfFirstPrompt + 1}-{Math.min(indexOfLastPrompt, filteredPrompts.length)} of {filteredPrompts.length}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-neutral-500">Loading prompts...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 mb-4">
                <img src="/assets/no-data.svg" alt="No data" className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-neutral-700 mb-2">No prompts found</h3>
              <p className="text-neutral-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
              <Button 
                variant="primary" 
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              {/* List View of Prompts */}
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="overflow-y-auto w-full" style={{ height: 'auto', maxHeight: 'calc(100vh - 500px)' }}>
                    <table className="w-full">
                      <thead className="sticky top-0 bg-neutral-50 z-10">
                        <tr className="border-b border-neutral-200">
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prompt</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-32">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Usage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-48">Last Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {currentPrompts.map(prompt => {
                          const isFavorite = favorites.some(f => f.id === prompt.id);
                          
                          return (
                            <tr key={prompt.id} className="hover:bg-neutral-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start">
                                  <button 
                                    onClick={() => toggleFavorite(prompt)}
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
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={prompt.category} size="sm">
                                  {prompt.category}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {prompt.usageCount} times
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-600">
                                {prompt.usedAt || 'Never used'}
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => openPlayground(prompt)}
                                  className="prompt-try-button"
                                  title="Use this prompt in the playground"
                                >
                                  Use Prompt
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
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
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
                          onClick={() => setCurrentPage(pageNum)}
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
                          onClick={() => setCurrentPage(totalPages)}
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
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    endIcon={<ChevronRight size={16} />}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptLibraryPage;