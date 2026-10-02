import { z } from 'zod';

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type Priority = z.infer<typeof PriorityEnum>;

export const StatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']);
export type Status = z.infer<typeof StatusEnum>;

export const createTicketSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must not exceed 120 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description is required'),
  customerEmail: z
    .string({ required_error: 'Customer email is required' })
    .trim()
    .email('Invalid email address format'),
  priority: PriorityEnum,
  status: StatusEnum.default('OPEN'),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z
  .object({
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.priority !== undefined,
    {
      message: 'At least one field (status or priority) must be provided for update',
    }
  );

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export interface Ticket {
  id: string;
  title: string;
  description: string;
  customerEmail: string;
  priority: Priority;
  status: Status;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TicketSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}
