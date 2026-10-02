import React from 'react';
import { Ticket } from '../../types/ticket';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { TableSkeleton } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { Calendar, Mail, ExternalLink } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  hasActiveFilters: boolean;
  onSelectTicket: (ticket: Ticket) => void;
  onResetFilters: () => void;
  onCreateTicket: () => void;
}

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
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center my-4">
        Failed to fetch support tickets from server. Please check your backend connection.
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View (md and up) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket Title</th>
                <th className="py-3.5 px-4">Customer Email</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4 font-medium text-slate-100 max-w-xs truncate group-hover:text-indigo-400">
                    {ticket.title}
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-xs font-mono">
                    {ticket.customerEmail}
                  </td>
                  <td className="py-4 px-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-400">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicket(ticket);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      View
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (below md) */}
      <div className="md:hidden space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 cursor-pointer hover:border-slate-700 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-slate-100 text-sm line-clamp-2">
                {ticket.title}
              </h4>
              <StatusBadge status={ticket.status} />
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">
              {ticket.description}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[140px]">{ticket.customerEmail}</span>
              </div>
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(ticket.createdAt)}
              </span>
              <span className="text-indigo-400 font-medium">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
