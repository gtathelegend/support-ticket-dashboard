import React from 'react';
import { Status, Priority } from '../../types/ticket';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<Status, string> = {
    OPEN: 'bg-[#E9F2FF] text-[#0C66E4] border-[#CCE0FF]',
    IN_PROGRESS: 'bg-[#FFF7D6] text-[#974F0C] border-[#F5CD47]',
    RESOLVED: 'bg-[#DFFCF0] text-[#216E4A] border-[#ABF5D1]',
  };

  const labels: Record<Status, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status]} whitespace-nowrap`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
        aria-hidden="true"
      />
      {labels[status]}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles: Record<Priority, string> = {
    HIGH: 'bg-[#FFECEB] text-[#AE2A19] border-[#FFC3BE]',
    MEDIUM: 'bg-[#FFF7D6] text-[#974F0C] border-[#F5CD47]',
    LOW: 'bg-[#F1F2F4] text-[#44546F] border-[#C1C7D0]',
  };

  const labels: Record<Priority, string> = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${styles[priority]} whitespace-nowrap`}
    >
      {labels[priority]}
    </span>
  );
};
