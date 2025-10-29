
import React from 'react';

interface CalcButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'number' | 'operator' | 'special';
}

export const CalcButton: React.FC<CalcButtonProps> = ({
  onClick,
  children,
  className = '',
  variant = 'number'
}) => {
  const baseClasses = 'h-16 sm:h-20 text-2xl sm:text-3xl font-medium rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 ease-in-out';
  
  const variantClasses = {
    number: 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500 focus:ring-gray-500',
    operator: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus:ring-orange-400',
    special: 'bg-gray-500 text-white hover:bg-gray-400 active:bg-gray-300 focus:ring-gray-400',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
