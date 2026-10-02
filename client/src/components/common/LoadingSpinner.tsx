import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading tickets...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-800/60 rounded-lg w-full"></div>
      ))}
    </div>
  );
};

export const CardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-slate-800/60 rounded-xl p-5 border border-slate-800"></div>
      ))}
    </div>
  );
};
