import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-rose-500',
  children,
  className = '',
  noPadding = false,
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={`glass-card ${noPadding ? '' : 'p-6'} ${
        hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''
      } transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className={`p-2 rounded-xl bg-white/50 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            {title && <h3 className="font-display font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
