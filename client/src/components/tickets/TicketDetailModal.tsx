import React, { useState, useEffect } from 'react';
import { Ticket, Status, Priority } from '../../types/ticket';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Mail, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TicketDetailModalProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
  ticketData?: Ticket;
  isLoading: boolean;
  isError: boolean;
  onUpdateTicket: (id: string, updates: { status?: Status; priority?: Priority }) => Promise<void>;
}

const detailLabelClass = 'text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide mb-1 block';
const selectClass =
  'w-full h-9 px-3 bg-white border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 transition-colors appearance-none cursor-pointer';

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticketId,
  isOpen,
  onClose,
  ticketData,
  isLoading,
  isError,
  onUpdateTicket,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>('OPEN');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIUM');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketData) {
      setSelectedStatus(ticketData.status);
      setSelectedPriority(ticketData.priority);
      setUpdateSuccess(false);
      setUpdateError(null);
    }
  }, [ticketData]);

  if (!isOpen || !ticketId) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const hasChanges =
    ticketData &&
    (selectedStatus !== ticketData.status || selectedPriority !== ticketData.priority);

  const handleSave = async () => {
    if (!ticketId || !hasChanges) return;

    try {
      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      const updates: { status?: Status; priority?: Priority } = {};
      if (selectedStatus !== ticketData?.status) updates.status = selectedStatus;
      if (selectedPriority !== ticketData?.priority) updates.priority = selectedPriority;

      await onUpdateTicket(ticketId, updates);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update ticket.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ticket details" maxWidth="lg">
      {isLoading ? (
        <LoadingSpinner message="Fetching ticket..." />
      ) : isError || !ticketData ? (
        <div className="px-3 py-2.5 bg-[#FFECEB] border border-[#FFC3BE] text-[#AE2A19] rounded-[4px] text-[13px]">
          Failed to load ticket details from server.
        </div>
      ) : (
        <div className="space-y-4">

          {/* Toast messages */}
          {updateSuccess && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#DFFCF0] border border-[#ABF5D1] text-[#216E4A] text-[12px] rounded-[4px]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Changes saved successfully.
            </div>
          )}
          {updateError && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FFECEB] border border-[#FFC3BE] text-[#AE2A19] text-[12px] rounded-[4px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {updateError}
            </div>
          )}

          {/* Ticket ID + current badges */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#7A869A] font-mono select-all" title="Ticket ID">
              #{ticketData.id.slice(0, 8).toUpperCase()}
            </span>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={ticketData.status} />
              <PriorityBadge priority={ticketData.priority} />
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#172B4D] leading-snug">
              {ticketData.title}
            </h3>
          </div>

          {/* Customer Email */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#DFE1E6] rounded-[4px]">
            <Mail className="w-3.5 h-3.5 text-[#7A869A] shrink-0" aria-hidden="true" />
            <span className="text-[12px] text-[#5E6C84] font-mono">
              {ticketData.customerEmail}
            </span>
          </div>

          {/* Description */}
          <div>
            <label className={detailLabelClass}>Description</label>
            <div className="px-3 py-2.5 bg-[#F7F8FA] border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] whitespace-pre-wrap leading-relaxed">
              {ticketData.description}
            </div>
          </div>

          {/* Update Status & Priority */}
          <div className="border border-[#DFE1E6] rounded-[6px] p-3.5 space-y-3 bg-white">
            <p className="text-[11px] font-semibold text-[#5E6C84] uppercase tracking-wide">
              Update ticket
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="detail-status" className={detailLabelClass}>
                  Status
                </label>
                <div className="relative">
                  <select
                    id="detail-status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Status)}
                    className={selectClass}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-[#7A869A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="detail-priority" className={detailLabelClass}>
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="detail-priority"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                    className={selectClass}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-[#7A869A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-[11px] text-[#7A869A]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              Created {formatDate(ticketData.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              Updated {formatDate(ticketData.updatedAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFE1E6]">
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!hasChanges}
              isLoading={isUpdating}
              onClick={handleSave}
            >
              Save changes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
