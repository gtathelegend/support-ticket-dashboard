import React from 'react';
import { PaginationMetadata } from '../../types/ticket';
import { Button } from '../common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TicketPaginationProps {
  pagination?: PaginationMetadata;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const TicketPagination: React.FC<TicketPaginationProps> = ({
  pagination,
  onPageChange,
  isLoading,
}) => {
  if (!pagination || pagination.totalItems === 0) {
    return null;
  }

  const { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-sm text-slate-400">
      <div className="text-xs sm:text-sm">
        Showing <span className="font-semibold text-slate-200">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-200">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-200">{totalItems}</span> tickets
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPreviousPage || isLoading}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage || isLoading}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
