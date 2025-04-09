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
    <div className="flex flex-wrap justify-center gap-3">
      {filterCategories.map(category => (
        <button
          key={category.id}
          onClick={() => handleFilterClick(category.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilters[category.id] 
              ? 'bg-primary-50 text-primary-600 border border-primary-200 shadow-sm' 
              : 'bg-neutral-100 text-neutral-600 border border-neutral-100 hover:bg-neutral-200'
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