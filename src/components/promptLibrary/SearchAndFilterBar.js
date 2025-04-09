// src/components/promptLibrary/SearchAndFilterBar.js
import React, { useState } from 'react';
import { Search, X, SortDesc, SortAsc, Grid, List, Filter } from 'lucide-react';

const SearchAndFilterBar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategories, 
  toggleCategory, 
  resetFilters,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortDirection,
  toggleSortDirection
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  return (
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
              <CategoryFilterButton 
                key={category}
                category={category}
                isSelected={selectedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
              />
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
  );
};

const CategoryFilterButton = ({ category, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
      isSelected
        ? 'bg-primary-50 text-primary-600 border border-primary-200'
        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
    }`}
  >
    {category.charAt(0).toUpperCase() + category.slice(1)}
  </button>
);

export default SearchAndFilterBar;