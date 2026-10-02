import React from 'react';
import { SearchX, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  type: 'no-results' | 'no-tickets';
  onResetFilters?: () => void;
  onCreateTicket?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onResetFilters,
  onCreateTicket,
}) => {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        <div className="w-10 h-10 rounded-full bg-[#F7F8FA] border border-[#DFE1E6] flex items-center justify-center mb-3">
          <SearchX className="w-5 h-5 text-[#7A869A]" />
        </div>
        <h3 className="text-[14px] font-semibold text-[#172B4D] mb-1">
          No tickets found
        </h3>
        <p className="text-[13px] text-[#5E6C84] max-w-xs mb-4">
          No tickets match your current filters. Try adjusting your search or
          clearing the filters.
        </p>
        {onResetFilters && (
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-10 h-10 rounded-full bg-[#F7F8FA] border border-[#DFE1E6] flex items-center justify-center mb-3">
        <Inbox className="w-5 h-5 text-[#7A869A]" />
      </div>
      <h3 className="text-[14px] font-semibold text-[#172B4D] mb-1">
        No support tickets
      </h3>
      <p className="text-[13px] text-[#5E6C84] max-w-xs mb-4">
        There are no tickets yet. Create a new ticket to get started.
      </p>
      {onCreateTicket && (
        <Button variant="primary" size="sm" onClick={onCreateTicket}>
          Create ticket
        </Button>
      )}
    </div>
  );
};
