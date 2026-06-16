import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
        {icon || <Inbox className="w-10 h-10 text-rose-300" />}
      </div>
      <h3 className="text-lg font-display font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm text-center max-w-sm mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
