import React from 'react';

interface LoaderProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ fullPage = false, size = 'md', text }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-rose-200 border-t-rose-500 animate-spin`}
        style={{ borderStyle: 'solid' }}
      />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">🌸</span>
            </div>
          </div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};
