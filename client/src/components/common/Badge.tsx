import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rose' | 'lavender' | 'sage' | 'coral' | 'gray' | 'red' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  rose: 'bg-rose-100 text-rose-700',
  lavender: 'bg-lavender-100 text-lavender-700',
  sage: 'bg-sage-100 text-sage-700',
  coral: 'bg-coral-100 text-coral-700',
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'rose',
  size = 'sm',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variantStyles[variant]} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${className}`}
    >
      {children}
    </span>
  );
};
