import {
  Ticket,
  TicketSummary,
  PaginatedTicketsResponse,
  TicketQueryParams,
  CreateTicketInput,
  UpdateTicketInput,
  ApiErrorResponse,
} from '../types/ticket';

class ApiClientError extends Error {
  public code: string;
  public details?: Array<{ field?: string; message: string }>;

  constructor(message: string, code = 'API_ERROR', details?: Array<{ field?: string; message: string }>) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.details = details;
  }
}

function getApiBaseUrl(): string {
  const baseUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (baseUrl.endsWith('/')) {
    return baseUrl.slice(0, -1);
  }
  return baseUrl;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (!response.ok || json.success === false) {
    const errResp = json as ApiErrorResponse;
    const message = errResp?.error?.message || `API HTTP Error ${response.status}`;
    const code = errResp?.error?.code || 'BAD_REQUEST';
    const details = errResp?.error?.details;
    throw new ApiClientError(message, code, details);
  }
  return json.data as T;
}

export const ticketApi = {
  async getTickets(params: TicketQueryParams = {}): Promise<PaginatedTicketsResponse> {
    const query = new URLSearchParams();

    if (params.search && params.search.trim().length > 0) {
      query.set('search', params.search.trim());
    }
    if (params.status) {
      query.set('status', params.status);
    }
    if (params.priority) {
      query.set('priority', params.priority);
    }
    if (params.sortBy) {
      query.set('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      query.set('sortOrder', params.sortOrder);
    }
    if (params.page) {
      query.set('page', params.page.toString());
    }
    if (params.limit) {
      query.set('limit', params.limit.toString());
    }

    const baseUrl = getApiBaseUrl();
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const url = `${baseUrl}/api/tickets${queryString}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    return handleResponse<PaginatedTicketsResponse>(response);
  },

  async getSummary(): Promise<TicketSummary> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/tickets/summary`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<TicketSummary>(response);
  },

  async getTicketById(id: string): Promise<Ticket> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/tickets/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse<Ticket>(response);
  },

  async createTicket(data: CreateTicketInput): Promise<Ticket> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },

  async updateTicket(id: string, data: UpdateTicketInput): Promise<Ticket> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/tickets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Ticket>(response);
  },
};

export { ApiClientError };
