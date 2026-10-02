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

const fieldClass =
  'w-full h-9 px-3 bg-white border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] placeholder-[#7A869A] focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 transition-colors hover:border-[#C1C7D0]';
const selectClass =
  'w-full h-9 px-3 bg-white border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 transition-colors hover:border-[#C1C7D0] appearance-none cursor-pointer';
const labelClass =
  'block text-[12px] font-semibold text-[#172B4D] mb-1';
const errorClass =
  'mt-1 text-[11px] text-[#AE2A19] font-medium';

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
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Create ticket" maxWidth="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>

        {serverError && (
          <div className="px-3 py-2.5 bg-[#FFECEB] border border-[#FFC3BE] text-[#AE2A19] text-[12px] rounded-[4px]">
            {serverError}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="create-title" className={labelClass}>
            Title <span className="text-[#AE2A19]" aria-hidden="true">*</span>
          </label>
          <input
            id="create-title"
            type="text"
            {...register('title')}
            placeholder="Brief summary of the issue (max 120 chars)"
            className={fieldClass}
            aria-required="true"
            aria-describedby={errors.title ? 'create-title-error' : undefined}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p id="create-title-error" className={errorClass} role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Customer Email */}
        <div>
          <label htmlFor="create-email" className={labelClass}>
            Customer email <span className="text-[#AE2A19]" aria-hidden="true">*</span>
          </label>
          <input
            id="create-email"
            type="email"
            {...register('customerEmail')}
            placeholder="customer@example.com"
            className={fieldClass}
            aria-required="true"
            aria-describedby={errors.customerEmail ? 'create-email-error' : undefined}
            aria-invalid={!!errors.customerEmail}
          />
          {errors.customerEmail && (
            <p id="create-email-error" className={errorClass} role="alert">
              {errors.customerEmail.message}
            </p>
          )}
        </div>

        {/* Priority & Status row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="create-priority" className={labelClass}>
              Priority <span className="text-[#AE2A19]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id="create-priority"
                {...register('priority')}
                className={selectClass}
                aria-required="true"
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
            {errors.priority && (
              <p className={errorClass} role="alert">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="create-status" className={labelClass}>
              Initial status
            </label>
            <div className="relative">
              <select
                id="create-status"
                {...register('status')}
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
        </div>

        {/* Description */}
        <div>
          <label htmlFor="create-description" className={labelClass}>
            Description <span className="text-[#AE2A19]" aria-hidden="true">*</span>
          </label>
          <textarea
            id="create-description"
            rows={4}
            {...register('description')}
            placeholder="Detailed description of the issue..."
            className="w-full px-3 py-2 bg-white border border-[#DFE1E6] rounded-[4px] text-[13px] text-[#172B4D] placeholder-[#7A869A] focus:outline-none focus:ring-2 focus:ring-[#0C66E4] focus:ring-offset-1 transition-colors hover:border-[#C1C7D0] resize-none leading-relaxed"
            aria-required="true"
            aria-describedby={errors.description ? 'create-desc-error' : undefined}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p id="create-desc-error" className={errorClass} role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFE1E6]">
          <Button type="button" variant="secondary" size="md" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
            Create ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
