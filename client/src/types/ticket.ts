import { Priority, Status, CreateTicketInput, UpdateTicketInput } from '@support-ticket-dashboard/shared';

export type { Priority, Status, CreateTicketInput, UpdateTicketInput };

export interface Ticket {
  id: string;
  title: string;
  description: string;
  customerEmail: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface TicketSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTicketsResponse {
  items: Ticket[];
  pagination: PaginationMetadata;
}

export interface TicketQueryParams {
  search?: string;
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}
