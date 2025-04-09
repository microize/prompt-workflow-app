import React from 'react';

/**
 * A reusable Button component with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.variant - primary, secondary, outline, text
 * @param {string} props.size - sm, md, lg
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {React.ReactNode} props.startIcon - Icon to show at the start of the button
 * @param {React.ReactNode} props.endIcon - Icon to show at the end of the button
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  className = '',
  children,
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'rounded-lg inline-flex items-center justify-center transition-colors font-medium';
  
  // Classes for different variants
  const variantClasses = {
    primary: disabled 
      ? 'bg-neutral-300 text-neutral-500' 
      : 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: disabled 
      ? 'bg-neutral-200 text-neutral-500' 
      : 'bg-secondary-500 hover:bg-secondary-600 text-white',
    outline: disabled 
      ? 'border border-neutral-300 text-neutral-500' 
      : 'border border-neutral-300 hover:bg-neutral-50 text-neutral-700',
    text: disabled 
      ? 'text-neutral-500' 
      : 'text-primary-500 hover:bg-primary-50'
  };
  
  // Classes for different sizes
  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6'
  };
  
  // Assemble the classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'cursor-not-allowed' : '',
    className
  ].join(' ');
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default Button;