import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div
        className="w-6 h-6 border-2 border-[#DFE1E6] border-t-[#0C66E4] rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-[13px] text-[#5E6C84]">{message}</p>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Header row */}
      <div className="h-9 bg-[#F7F8FA] border-b border-[#DFE1E6]" />
      {/* Data rows */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-[#DFE1E6]"
        >
          <div className="h-3.5 bg-[#DFE1E6] rounded flex-1 max-w-xs" />
          <div className="h-3.5 bg-[#DFE1E6] rounded w-36" />
          <div className="h-5 bg-[#DFE1E6] rounded w-14" />
          <div className="h-5 bg-[#DFE1E6] rounded w-16" />
          <div className="h-3.5 bg-[#DFE1E6] rounded w-24" />
        </div>
      ))}
    </div>
  );
};

export const CardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-[#F7F8FA] rounded-[6px] border border-[#DFE1E6]"
        />
      ))}
    </div>
  );
};
