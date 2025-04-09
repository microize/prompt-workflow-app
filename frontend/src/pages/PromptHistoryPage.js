import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Download, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SortDesc,
  Clock,
  AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const PromptHistoryPage = () => {
  // Mock data for history entries
  const [historyEntries, setHistoryEntries] = useState([
    { 
      id: 1, 
      prompt: "Create a landing page for a SaaS product", 
      model: "GPT-4", 
      timestamp: "2025-04-07T14:30:00", 
      category: "web", 
      status: "completed",
      responseLength: 1243
    },
    { 
      id: 2, 
      prompt: "Design a logo for a coffee shop", 
      model: "Claude", 
      timestamp: "2025-04-07T10:15:00", 
      category: "design", 
      status: "completed",
      responseLength: 856
    },
    { 
      id: 3, 
      prompt: "Write a product description for a smartphone", 
      model: "GPT-4", 
      timestamp: "2025-04-06T16:45:00", 
      category: "writing", 
      status: "completed",
      responseLength: 612
    },
    { 
      id: 4, 
      prompt: "Create an email marketing campaign", 
      model: "Claude", 
      timestamp: "2025-04-06T09:20:00", 
      category: "marketing", 
      status: "completed",
      responseLength: 1589
    },
    { 
      id: 5, 
      prompt: "Generate social media content for a restaurant", 
      model: "GPT-4", 
      timestamp: "2025-04-05T13:10:00", 
      category: "marketing", 
      status: "completed",
      responseLength: 943
    }
  ]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('all'); // 'today', 'week', 'month', 'all'
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  
  // Filter entries when search or filters change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      let filtered = [...historyEntries];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(entry => 
          entry.prompt.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply date range filter
      if (dateRange !== 'all') {
        const now = new Date();
        const startDate = new Date();
        
        if (dateRange === 'today') {
          startDate.setHours(0, 0, 0, 0);
        } else if (dateRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (dateRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        }
        
        filtered = filtered.filter(entry => 
          new Date(entry.timestamp) >= startDate
        );
      }
      
      // Apply model filter
      if (selectedModels.length > 0) {
        filtered = filtered.filter(entry => 
          selectedModels.includes(entry.model)
        );
      }
      
      // Apply category filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(entry => 
          selectedCategories.includes(entry.category)
        );
      }
      
      // Sort by timestamp (newest first)
      filtered.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setFilteredEntries(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, dateRange, selectedModels, selectedCategories, historyEntries]);
  
  // Toggle model selection
  const toggleModel = (model) => {
    setSelectedModels(prev => 
      prev.includes(model) 
        ? prev.filter(m => m !== model) 
        : [...prev, model]
    );
  };
  
  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setDateRange('all');
    setSelectedModels([]);
    setSelectedCategories([]);
  };
  
  // Clear history (would connect to actual API in real implementation)
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire prompt history? This action cannot be undone.')) {
      setHistoryEntries([]);
    }
  };
  
  // Download history (would implement actual CSV/JSON export in real implementation)
  const downloadHistory = () => {
    alert('History export initiated.');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  
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
              <h2 className="text-xl font-semibold">Prompt History</h2>
              <p className="text-sm text-neutral-500 mt-1">View and manage your previous prompt executions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                startIcon={<Download size={18} />}
                onClick={downloadHistory}
              >
                Export History
              </Button>
              
              <Button
                variant="outline"
                startIcon={<Trash2 size={18} />}
                onClick={clearHistory}
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                Clear History
              </Button>
            </div>
          </div>
        </div>
        
        <div className="px-6 pt-6 pb-0 flex flex-col flex-grow">
          {/* Search and Filter Area */}
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompt history..."
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
              
              {/* Date Range Filter */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none bg-white"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>
              
              {/* Filter Button */}
              <div className="lg:col-span-1">
                <Button
                  variant="outline"
                  startIcon={<Filter size={18} />}
                  className="w-full justify-center"
                  onClick={() => {
                    // Toggle advanced filters UI (not implemented in this example)
                    alert('Advanced filters would show here');
                  }}
                >
                  Filter
                </Button>
              </div>
            </div>
            
            {/* Filter Tags */}
            <div className="flex flex-wrap items-center mt-4 gap-2">
              {/* Model Filters */}
              <div className="flex items-center mr-2">
                <span className="text-sm text-neutral-500 mr-2">Models:</span>
                <button
                  onClick={() => toggleModel('GPT-4')}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedModels.includes('GPT-4')
                      ? 'bg-primary-50 text-primary-600 border-primary-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  GPT-4
                </button>
                <button
                  onClick={() => toggleModel('Claude')}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ml-2 ${
                    selectedModels.includes('Claude')
                      ? 'bg-primary-50 text-primary-600 border-primary-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Claude
                </button>
              </div>
              
              {/* Category Filters */}
              <div className="flex items-center flex-wrap">
                <span className="text-sm text-neutral-500 mr-2">Categories:</span>
                {['web', 'design', 'writing', 'marketing'].map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ml-2 ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-50 text-primary-600 border-primary-200'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Reset Filters */}
              {(searchQuery || dateRange !== 'all' || selectedModels.length > 0 || selectedCategories.length > 0) && (
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
          
          {/* Results List */}
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-neutral-700">
                {isLoading ? 'Loading history...' : `${filteredEntries.length} Results`}
              </h3>
              
              {/* Pagination info */}
              {!isLoading && filteredEntries.length > 0 && (
                <div className="text-sm text-neutral-500">
                  Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, filteredEntries.length)} of {filteredEntries.length}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-center py-12 flex-grow">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-2 text-neutral-500">Loading history...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 flex-grow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 mb-4">
                  <Clock size={28} />
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-2">No prompt history found</h3>
                <p className="text-neutral-500 mb-4">
                  {historyEntries.length === 0 
                    ? "You haven't executed any prompts yet. Try using the playground to get started." 
                    : "No results match your current filters."
                  }
                </p>
                {historyEntries.length > 0 && (
                  <Button 
                    variant="primary" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col flex-grow">
                <div className="flex flex-col flex-grow overflow-hidden">
                  <div className="overflow-y-auto w-full flex-grow">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-neutral-50 z-10">
                        <tr className="border-b border-neutral-200">
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prompt</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Model</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-48">Timestamp</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-32">Tokens</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {currentEntries.map(entry => (
                          <tr key={entry.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium text-neutral-800 line-clamp-2">
                                {entry.prompt}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {entry.model}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={entry.category} size="sm">
                                {entry.category}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {formatDate(entry.timestamp)}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {entry.responseLength}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  // Rerun the prompt in playground (not implemented in this example)
                                  alert(`Would rerun prompt: ${entry.prompt}`);
                                }}
                                className="w-full justify-center"
                              >
                                Reuse
                              </Button>
                            </td>
                          </tr>
                        ))}
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

export default PromptHistoryPage;