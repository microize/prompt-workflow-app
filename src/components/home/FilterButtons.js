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
              ? 'bg-[#4285f4] text-white border-[#4285f4]' 
              : 'bg-white text-[#3c4043] border-gray-200 hover:bg-[#f8f9fa]'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;