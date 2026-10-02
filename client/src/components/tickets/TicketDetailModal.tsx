import React, { useState, useEffect } from 'react';
import { Ticket, Status, Priority } from '../../types/ticket';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Calendar, Mail, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TicketDetailModalProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
  ticketData?: Ticket;
  isLoading: boolean;
  isError: boolean;
  onUpdateTicket: (id: string, updates: { status?: Status; priority?: Priority }) => Promise<void>;
}

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
    }
  }, [ticketData]);

  if (!isOpen || !ticketId) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
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
    <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" maxWidth="lg">
      {isLoading ? (
        <LoadingSpinner message="Fetching ticket details..." />
      ) : isError || !ticketData ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
          Failed to load ticket details from server.
        </div>
      ) : (
        <div className="space-y-6">
          {updateSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Ticket status/priority updated successfully!
            </div>
          )}

          {updateError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              {updateError}
            </div>
          )}

          {/* Header info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>ID: {ticketData.id}</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={ticketData.status} />
                <PriorityBadge priority={ticketData.priority} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{ticketData.title}</h3>
          </div>

          {/* Customer Email */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center gap-2 text-sm text-slate-300">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-xs text-slate-400">{ticketData.customerEmail}</span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </label>
            <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {ticketData.description}
            </div>
          </div>

          {/* Editable Status & Priority Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Update Ticket State
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Status)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Created: {formatDate(ticketData.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Updated: {formatDate(ticketData.updatedAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={!hasChanges}
              isLoading={isUpdating}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
