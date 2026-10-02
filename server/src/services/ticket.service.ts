import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import {
  CreateTicketInput,
  UpdateTicketInput,
  Priority,
  Status,
} from '@support-ticket-dashboard/shared';

export interface GetTicketsQuery {
  search?: string;
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedTicketsResult {
  items: Array<{
    id: string;
    title: string;
    description: string;
    customerEmail: string;
    priority: Priority;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class TicketService {
  async createTicket(data: CreateTicketInput) {
    return prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        customerEmail: data.customerEmail,
        priority: data.priority,
        status: data.status,
      },
    });
  }

  async getTickets(query: GetTicketsQuery): Promise<PaginatedTicketsResult> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TicketWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.search && query.search.trim().length > 0) {
      const searchTerm = query.search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { customerEmail: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [totalItems, items] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async getTicketById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
    });
  }

  async updateTicket(id: string, data: UpdateTicketInput) {
    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    return prisma.ticket.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
      },
    });
  }

  async getTicketSummary() {
    const [total, open, inProgress, resolved] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'RESOLVED' } }),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
    };
  }
}

export const ticketService = new TicketService();
