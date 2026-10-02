import React from 'react';
import { PaginationMetadata } from '../../types/ticket';
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

  const { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage } =
    pagination;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const paginationBtnBase =
    'h-8 px-2.5 inline-flex items-center gap-1 text-[12px] font-medium border rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed';
  const paginationBtnNormal =
    'bg-white text-[#172B4D] border-[#DFE1E6] hover:bg-[#F7F8FA]';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 border-t border-[#DFE1E6]">
      {/* Count display */}
      <p className="text-[12px] text-[#5E6C84]">
        Showing{' '}
        <span className="font-semibold text-[#172B4D]">{startItem}</span>
        {' '}–{' '}
        <span className="font-semibold text-[#172B4D]">{endItem}</span>
        {' '}of{' '}
        <span className="font-semibold text-[#172B4D]">{totalItems}</span>
        {' '}tickets
      </p>

      {/* Page Controls */}
      <div className="flex items-center gap-1.5">
        <button
          className={`${paginationBtnBase} ${paginationBtnNormal}`}
          disabled={!hasPreviousPage || isLoading}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        {/* Page number pills */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Show: first, last, current, and neighbors
              return (
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1
              );
            })
            .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) {
                acc.push('ellipsis');
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1.5 text-[12px] text-[#7A869A]"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  disabled={isLoading}
                  aria-label={`Go to page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  className={`h-8 w-8 inline-flex items-center justify-center text-[12px] font-medium border rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 ${
                    item === page
                      ? 'bg-[#0C66E4] text-white border-[#0C66E4]'
                      : 'bg-white text-[#172B4D] border-[#DFE1E6] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {item}
                </button>
              )
            )}
        </div>

        <button
          className={`${paginationBtnBase} ${paginationBtnNormal}`}
          disabled={!hasNextPage || isLoading}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
