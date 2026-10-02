import React from 'react';
import { SearchX, Inbox, RotateCcw } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 my-4">
        <div className="p-3 bg-slate-800/80 rounded-full text-slate-400 mb-3">
          <SearchX className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">No tickets match your filters</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-5">
          Try adjusting your search term, status filter, or priority filter to find what you're looking for.
        </p>
        {onResetFilters && (
          <Button variant="secondary" onClick={onResetFilters} className="inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 my-4">
      <div className="p-3 bg-slate-800/80 rounded-full text-slate-400 mb-3">
        <Inbox className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">No support tickets yet</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5">
        There are currently no support tickets in the database. Create a new ticket to get started.
      </p>
      {onCreateTicket && (
        <Button variant="primary" onClick={onCreateTicket}>
          Create First Ticket
        </Button>
      )}
    </div>
  );
};
