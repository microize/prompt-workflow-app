// src/components/common/Pagination.js
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  return (
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
  );
};

export default Pagination;