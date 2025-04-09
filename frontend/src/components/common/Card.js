import React from 'react';

/**
 * A reusable Card component with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.titleIcon - Icon to show alongside the title
 * @param {React.ReactNode} props.headerActions - Actions to show in the header
 * @param {boolean} props.noPadding - Whether to remove padding from the content area
 * @param {string} props.className - Additional classes for the card
 * @param {string} props.contentClassName - Additional classes for the content area
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({ 
  title,
  titleIcon,
  headerActions,
  noPadding = false,
  className = '',
  contentClassName = '',
  children,
  ...rest
}) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-200 ${className}`}
      {...rest}
    >
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
          {title && (
            <div className="flex items-center">
              {titleIcon && <span className="mr-2">{titleIcon}</span>}
              <h2 className="font-medium text-neutral-700">{title}</h2>
            </div>
          )}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-5'} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;