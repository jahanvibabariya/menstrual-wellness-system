import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: { value: number; isPositive: boolean };
  color?: 'rose' | 'lavender' | 'sage' | 'coral' | 'blue';
  className?: string;
}

const colorMap = {
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-500',
    trend: 'text-rose-600',
  },
  lavender: {
    bg: 'bg-lavender-50',
    icon: 'text-lavender-500',
    trend: 'text-lavender-600',
  },
  sage: {
    bg: 'bg-sage-50',
    icon: 'text-sage-600',
    trend: 'text-sage-600',
  },
  coral: {
    bg: 'bg-coral-50',
    icon: 'text-coral-500',
    trend: 'text-coral-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    trend: 'text-blue-600',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  trend,
  color = 'rose',
  className = '',
}) => {
  const colors = colorMap[color];

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend.isPositive ? 'text-sage-600' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
};
