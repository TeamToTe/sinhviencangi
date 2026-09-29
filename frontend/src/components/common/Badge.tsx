import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-amber-100 text-amber-800 border-amber-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    outline: 'bg-white text-gray-700 border-gray-300 shadow-xs',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-bold',
    md: 'text-xs px-2.5 py-1 rounded-full font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
