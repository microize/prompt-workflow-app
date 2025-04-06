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
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {filterCategories.map(category => (
        <button
          key={category.id}
          onClick={() => handleFilterClick(category.id)}
          className={`px-5 py-2 rounded-full transition-colors ${
            activeFilters[category.id] 
              ? 'bg-[#4285f4] text-white' 
              : 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;