import React from 'react';
import { TicketSummary } from '../../types/ticket';
import { CardsSkeleton } from '../common/LoadingSpinner';
import { Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface TicketSummaryCardsProps {
  summary?: TicketSummary;
  isLoading: boolean;
  isError: boolean;
}

export const TicketSummaryCards: React.FC<TicketSummaryCardsProps> = ({
  summary,
  isLoading,
  isError,
}) => {
  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError || !summary) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
        Failed to load summary statistics.
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Tickets',
      count: summary.total,
      icon: Ticket,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Open',
      count: summary.open,
      icon: AlertCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      title: 'In Progress',
      count: summary.inProgress,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Resolved',
      count: summary.resolved,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.title}
            className={`p-5 bg-slate-900 border ${card.borderColor} rounded-xl shadow-sm flex items-center justify-between transition-all hover:bg-slate-900/80`}
          >
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">
                {card.count.toLocaleString()}
              </h3>
            </div>
            <div className={`p-3 ${card.bgColor} ${card.color} rounded-xl`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
