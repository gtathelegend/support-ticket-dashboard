import React from 'react';
import { TicketSummary } from '../../types/ticket';
import { CardsSkeleton } from '../common/LoadingSpinner';

interface TicketSummaryCardsProps {
  summary?: TicketSummary;
  isLoading: boolean;
  isError: boolean;
}

interface MetricCardProps {
  label: string;
  value: number;
  accent: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, accent }) => (
  <div className="bg-white border border-[#DFE1E6] rounded-[6px] px-4 py-3.5 flex flex-col gap-1"
    style={{ boxShadow: '0 1px 2px 0 rgba(9, 30, 66, 0.06)' }}
  >
    <span className={`text-[11px] font-semibold uppercase tracking-wide ${accent}`}>
      {label}
    </span>
    <span className="text-2xl font-bold text-[#172B4D] leading-none">
      {value.toLocaleString()}
    </span>
  </div>
);

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
      <div className="px-3 py-2.5 bg-[#FFECEB] border border-[#FFC3BE] text-[#AE2A19] rounded-[6px] text-[13px]">
        Failed to load summary statistics.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Total tickets"
        value={summary.total}
        accent="text-[#5E6C84]"
      />
      <MetricCard
        label="Open"
        value={summary.open}
        accent="text-[#0C66E4]"
      />
      <MetricCard
        label="In Progress"
        value={summary.inProgress}
        accent="text-[#974F0C]"
      />
      <MetricCard
        label="Resolved"
        value={summary.resolved}
        accent="text-[#216E4A]"
      />
    </div>
  );
};
