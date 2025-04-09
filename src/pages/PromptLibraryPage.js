// src/pages/PromptLibraryPage.js
import React from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import Button from '../components/common/Button';
import { usePromptLibrary } from '../hooks/usePromptLibrary';
import LibraryHeader from '../components/promptLibrary/LibraryHeader';
import SearchAndFilterBar from '../components/promptLibrary/SearchAndFilterBar';
import PromptGrid from '../components/promptLibrary/PromptGrid';
import PromptList from '../components/promptLibrary/PromptList';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/promptLibrary/EmptyState';
import PromptDetailPanel from '../components/promptLibrary/PromptDetailPanel';
import DeletePromptModal from '../components/promptLibrary/DeletePromptModal';
import { useAppContext } from '../context/AppContext';

const PromptLibraryPage = () => {
  const { openPlayground } = useAppContext();
  const { 
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
  } = usePromptLibrary();

  return (
    <div 
      className={`p-0 h-full bg-neutral-50 flex flex-col ${isDraggedOver ? 'bg-primary-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <LibraryHeader 
          onImport={handleImportClick}
          onExport={handleExport}
          onNewPrompt={() => openPlayground(null)}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
        
        <div className="px-6 pt-6 pb-0 flex flex-col flex-grow">
          {/* Search and Filter Bar */}
          <SearchAndFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            resetFilters={resetFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            toggleSortDirection={toggleSortDirection}
          />
          
          {/* Results Area */}
          <div className="flex flex-grow">
            {/* Main Content */}
            <div className={`flex flex-col flex-grow transition-all duration-300 ${
              selectedPrompt ? 'md:pr-4' : ''
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-neutral-700">
                  {isLoading ? 'Loading prompts...' : `${filteredPrompts.length} Results`}
                </h3>
                
                {/* Pagination info */}
                {!isLoading && filteredPrompts.length > 0 && (
                  <div className="text-sm text-neutral-500">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPrompts.length)} of {filteredPrompts.length}
                  </div>
                )}
              </div>
              
              {isLoading ? (
                <div className="text-center py-12 flex-grow flex flex-col items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  <p className="mt-2 text-neutral-500">Loading prompts...</p>
                </div>
              ) : filteredPrompts.length === 0 ? (
                <EmptyState 
                  onCreatePrompt={() => openPlayground(null)}
                  onResetFilters={resetFilters}
                  hasPrompts={filteredPrompts.length > 0}
                />
              ) : viewMode === 'grid' ? (
                <PromptGrid 
                  prompts={currentItems}
                  selectedPromptId={selectedPrompt?.id}
                  onSelectPrompt={handlePromptSelect}
                  onDelete={(prompt) => {
                    setPromptToDelete(prompt);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ) : (
                <PromptList 
                  prompts={currentItems}
                  selectedPromptId={selectedPrompt?.id}
                  onSelectPrompt={handlePromptSelect}
                  onDelete={(prompt) => {
                    setPromptToDelete(prompt);
                    setIsDeleteModalOpen(true);
                  }}
                />
              )}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                />
              )}
            </div>
            
            {/* Details Panel */}
            {selectedPrompt && (
              <PromptDetailPanel 
                prompt={selectedPrompt}
                onClose={() => setSelectedPrompt(null)}
                onUsePrompt={() => openPlayground(selectedPrompt)}
                onDelete={() => {
                  setPromptToDelete(selectedPrompt);
                  setIsDeleteModalOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* File Upload Drag Area Overlay */}
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
        <DeletePromptModal 
          prompt={promptToDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setPromptToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default PromptLibraryPage;