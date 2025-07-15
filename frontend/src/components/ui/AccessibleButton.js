import React from 'react';
import { Loader2 } from 'lucide-react';

const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ariaLabel,
  ariaDescribedBy,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-blue disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-cyber-blue text-white hover:bg-cyber-blue/90 focus:ring-cyber-blue',
    secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-cyber-red text-white hover:bg-cyber-red/90 focus:ring-cyber-red',
    ghost: 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500',
    success: 'bg-cyber-green text-white hover:bg-cyber-green/90 focus:ring-cyber-green'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  const iconSizeClasses = {
    small: 12,
    medium: 16,
    large: 20
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const iconSize = iconSizeClasses[size];
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {loading && (
        <Loader2 
          size={iconSize} 
          className={`animate-spin ${children ? 'mr-2' : ''}`}
          aria-hidden="true"
        />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon 
          size={iconSize} 
          className={children ? 'mr-2' : ''}
          aria-hidden="true"
        />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon 
          size={iconSize} 
          className={children ? 'ml-2' : ''}
          aria-hidden="true"
        />
      )}
      
      {loading && (
        <span className="sr-only">Loading...</span>
      )}
    </button>
  );
};

export default AccessibleButton;