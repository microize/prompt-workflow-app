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
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {filterCategories.map(category => (
        <button
          key={category.id}
          onClick={() => handleFilterClick(category.id)}
          className={`px-4 py-2 rounded-lg ${
            activeFilters[category.id] 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;