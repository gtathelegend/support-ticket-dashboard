import React from 'react';
import { Ticket } from '../../types/ticket';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { TableSkeleton } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { Mail, Calendar } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  hasActiveFilters: boolean;
  onSelectTicket: (ticket: Ticket) => void;
  onResetFilters: () => void;
  onCreateTicket: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  isLoading,
  isError,
  hasActiveFilters,
  onSelectTicket,
  onResetFilters,
  onCreateTicket,
}) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="px-4 py-3 bg-[#FFECEB] border border-[#FFC3BE] text-[#AE2A19] rounded-[6px] text-[13px] text-center">
        Failed to fetch tickets from server. Please check your backend connection.
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        type={hasActiveFilters ? 'no-results' : 'no-tickets'}
        onResetFilters={onResetFilters}
        onCreateTicket={onCreateTicket}
      />
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#DFE1E6] bg-[#F7F8FA]">
              <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide">
                Ticket
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide">
                Customer
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide">
                Priority
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide">
                Status
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, idx) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={`border-b border-[#DFE1E6] cursor-pointer hover:bg-[#F7F8FA] transition-colors group ${
                  idx === tickets.length - 1 ? 'border-b-0' : ''
                }`}
                tabIndex={0}
                role="button"
                aria-label={`View ticket: ${ticket.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTicket(ticket);
                  }
                }}
              >
                <td className="py-3 px-4 max-w-[280px]">
                  <span
                    className="text-[13px] font-medium text-[#172B4D] truncate block group-hover:text-[#0C66E4] transition-colors"
                    title={ticket.title}
                  >
                    {ticket.title}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[12px] text-[#5E6C84] font-mono truncate block max-w-[180px]">
                    {ticket.customerEmail}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-[12px] text-[#7A869A]">
                    {formatDate(ticket.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className="bg-white border border-[#DFE1E6] rounded-[6px] p-3.5 cursor-pointer hover:border-[#C1C7D0] hover:bg-[#F7F8FA] transition-colors"
            style={{ boxShadow: '0 1px 2px rgba(9, 30, 66, 0.06)' }}
            role="button"
            tabIndex={0}
            aria-label={`View ticket: ${ticket.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTicket(ticket);
              }
            }}
          >
            {/* Title + Status */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-[13px] font-semibold text-[#172B4D] leading-snug line-clamp-2 flex-1">
                {ticket.title}
              </h4>
              <StatusBadge status={ticket.status} />
            </div>

            {/* Customer email */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <Mail className="w-3 h-3 text-[#7A869A] shrink-0" aria-hidden="true" />
              <span className="text-[11px] text-[#5E6C84] font-mono truncate">
                {ticket.customerEmail}
              </span>
            </div>

            {/* Footer: Priority + Date */}
            <div className="flex items-center justify-between pt-2 border-t border-[#DFE1E6]">
              <PriorityBadge priority={ticket.priority} />
              <div className="flex items-center gap-1 text-[11px] text-[#7A869A]">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {formatDate(ticket.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
