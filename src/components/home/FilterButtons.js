import React from 'react';
import { useAppContext } from '../../context/AppContext';

const FilterButtons = () => {
  const { activeFilters, handleFilterClick } = useAppContext();
  
  // Available filter categories
  const filterCategories = [
    { id: 'web', label: 'Web' },
    { id: 'design', label: 'Design' },
    { id: 'writing', label: 'Writing' },
    { id: 'marketing', label: 'Marketing' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {filterCategories.map(category => (
        <button
          key={category.id}
          onClick={() => handleFilterClick(category.id)}
          className={`px-6 py-3 rounded-full text-sm font-medium transition-colors border ${
            activeFilters[category.id] 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
          aria-pressed={activeFilters[category.id]}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;