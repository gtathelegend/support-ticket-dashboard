import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTicketSchema, CreateTicketInput } from '@support-ticket-dashboard/shared';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ApiClientError } from '../../api/ticketApi';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTicket: (data: CreateTicketInput) => Promise<void>;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmitTicket,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      customerEmail: '',
      priority: 'MEDIUM',
      status: 'OPEN',
    },
  });

  const handleFormSubmit = async (data: CreateTicketInput) => {
    try {
      setServerError(null);
      await onSubmitTicket(data);
      reset();
      onClose();
    } catch (err: any) {
      if (err instanceof ApiClientError && err.details) {
        err.details.forEach((d) => {
          if (d.field) {
            setError(d.field as keyof CreateTicketInput, { message: d.message });
          }
        });
      }
      setServerError(err.message || 'Failed to create ticket.');
    }
  };

  const handleModalClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Create Support Ticket" maxWidth="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {serverError}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="Brief description of issue (max 120 chars)"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Customer Email <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            {...register('customerEmail')}
            placeholder="customer@example.com"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.customerEmail && (
            <p className="mt-1 text-xs text-rose-400 font-medium">
              {errors.customerEmail.message}
            </p>
          )}
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Priority <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Initial Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            {...register('description')}
            placeholder="Detailed explanation of the support ticket issue..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-400 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
