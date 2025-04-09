import React from 'react';

/**
 * A reusable Badge component for category tags, labels, etc.
 * 
 * @param {Object} props
 * @param {string} props.variant - default, primary, secondary, success, danger, etc.
 * @param {string} props.size - sm, md
 * @param {string} props.className - Additional classes
 * @param {React.ReactNode} props.children - Badge content
 */
const Badge = ({ 
  variant = 'default',
  size = 'sm',
  className = '',
  children,
  ...rest
}) => {
  // Base badge classes
  const baseClasses = 'inline-flex items-center justify-center rounded-full';
  
  // Classes for different variants
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-600',
    primary: 'bg-primary-50 text-primary-500',
    secondary: 'bg-secondary-50 text-secondary-500',
    success: 'bg-success-50 text-success-500',
    danger: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-500',
    web: 'bg-primary-50 text-primary-500',
    design: 'bg-purple-50 text-purple-500',
    writing: 'bg-success-50 text-success-500',
    marketing: 'bg-secondary-50 text-secondary-500',
    business: 'bg-blue-50 text-blue-500',
    development: 'bg-indigo-50 text-indigo-500'
  };
  
  // Classes for different sizes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1'
  };
  
  // Assemble the classes
  const badgeClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size],
    className
  ].join(' ');
  
  return (
    <span
      className={badgeClasses}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Badge;