import { z } from 'zod';
import {
  PriorityEnum,
  StatusEnum,
  createTicketSchema,
  updateTicketSchema,
} from '@support-ticket-dashboard/shared';

export const ticketParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid ticket ID format. Must be a valid UUID.' }),
});

export const ticketQuerySchema = z.object({
  search: z.string().optional(),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'title', 'priority', 'status'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a valid number' })
    .int({ message: 'Page must be an integer' })
    .positive({ message: 'Page must be a positive integer (greater than 0)' })
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a valid number' })
    .int({ message: 'Limit must be an integer' })
    .positive({ message: 'Limit must be a positive integer' })
    .max(10, { message: 'Limit cannot exceed 10 items per page' })
    .default(10),
});

export { createTicketSchema, updateTicketSchema };
