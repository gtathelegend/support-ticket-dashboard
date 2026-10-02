import React from 'react';
import { Status, Priority } from '../../types/ticket';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<Status, string> = {
    OPEN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    RESOLVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const labels: Record<Status, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full fill-current bg-current" />
      {labels[status]}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles: Record<Priority, string> = {
    LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    MEDIUM: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const labels: Record<Priority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
};
