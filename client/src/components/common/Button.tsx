import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'gradient-primary text-white shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]',
    secondary:
      'bg-white/80 backdrop-blur text-rose-600 border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    danger:
      'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]',
    ghost:
      'bg-transparent text-gray-600 hover:bg-rose-50/60 hover:text-rose-600 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
