import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const selectClass =
  'h-9 px-2.5 pr-7 bg-white border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 transition-colors hover:border-[#C1C7D0]';

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Search className="w-3.5 h-3.5 text-[#7A869A]" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tickets or customer email..."
          className="w-full h-9 pl-8 pr-8 bg-white border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] placeholder-[#7A869A] focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 transition-colors hover:border-[#C1C7D0]"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#7A869A] hover:text-[#172B4D] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-[#7A869A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={selectClass}
            aria-label="Filter by priority"
          >
            <option value="ALL">Priority: All</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-[#7A869A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort Order */}
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
            className={selectClass}
            aria-label="Sort order"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-[#7A869A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="h-9 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#F7F8FA] border border-[#DFE1E6] rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1"
            title="Clear all filters"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
