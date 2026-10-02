import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from './api/ticketApi';
import { Status, Priority, CreateTicketInput, UpdateTicketInput, Ticket } from './types/ticket';
import { useDebounce } from './hooks/useDebounce';
import { TicketSummaryCards } from './components/tickets/TicketSummaryCards';
import { TicketFilters } from './components/tickets/TicketFilters';
import { TicketList } from './components/tickets/TicketList';
import { TicketPagination } from './components/tickets/TicketPagination';
import { CreateTicketModal } from './components/tickets/CreateTicketModal';
import { TicketDetailModal } from './components/tickets/TicketDetailModal';
import { Button } from './components/common/Button';
import { Plus, LifeBuoy } from 'lucide-react';

export function App() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Read URL Search Parameters
  const initialSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  const statusParam = searchParams.get('status') || 'ALL';
  const priorityParam = searchParams.get('priority') || 'ALL';
  const sortOrderParam = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // 2. Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Sync debounced search to URL searchParams
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set('search', debouncedSearch);
        } else {
          next.delete('search');
        }
        // Reset page to 1 when search term changes
        if (prev.get('search') !== debouncedSearch) {
          next.set('page', '1');
        }
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  // Construct query object for API
  const queryParams = {
    search: debouncedSearch || undefined,
    status: statusParam !== 'ALL' ? (statusParam as Status) : undefined,
    priority: priorityParam !== 'ALL' ? (priorityParam as Priority) : undefined,
    sortBy: 'createdAt',
    sortOrder: sortOrderParam,
    page: pageParam,
    limit: 10,
  };

  // 3. TanStack Queries
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isError: isTicketsError,
  } = useQuery({
    queryKey: ['tickets', queryParams],
    queryFn: () => ticketApi.getTickets(queryParams),
  });

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useQuery({
    queryKey: ['ticketSummary'],
    queryFn: () => ticketApi.getSummary(),
  });

  const {
    data: selectedTicketData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ['ticket', selectedTicketId],
    queryFn: () => ticketApi.getTicketById(selectedTicketId!),
    enabled: !!selectedTicketId,
  });

  // 4. Mutations
  const createMutation = useMutation({
    mutationFn: (newTicket: CreateTicketInput) => ticketApi.createTicket(newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketSummary'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTicketInput }) =>
      ticketApi.updateTicket(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketSummary'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });

  // Filter change handlers (sync to URL)
  const handleStatusChange = (newStatus: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStatus !== 'ALL') {
        next.set('status', newStatus);
      } else {
        next.delete('status');
      }
      next.set('page', '1');
      return next;
    });
  };

  const handlePriorityChange = (newPriority: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPriority !== 'ALL') {
        next.set('priority', newPriority);
      } else {
        next.delete('priority');
      }
      next.set('page', '1');
      return next;
    });
  };

  const handleSortOrderChange = (newOrder: 'asc' | 'desc') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sortOrder', newOrder);
      next.set('page', '1');
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    searchInput || statusParam !== 'ALL' || priorityParam !== 'ALL' || pageParam > 1
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100 leading-none">
                SupportDesk
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Ticket Operations Dashboard</p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Statistics KPI Cards */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            Summary Metrics
          </h2>
          <TicketSummaryCards
            summary={summaryData}
            isLoading={isSummaryLoading}
            isError={isSummaryError}
          />
        </section>

        {/* Filter & Search Bar */}
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">
            Filter Controls
          </h2>
          <TicketFilters
            search={searchInput}
            onSearchChange={setSearchInput}
            status={statusParam}
            onStatusChange={handleStatusChange}
            priority={priorityParam}
            onPriorityChange={handlePriorityChange}
            sortOrder={sortOrderParam}
            onSortOrderChange={handleSortOrderChange}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </section>

        {/* Tickets List Section */}
        <section aria-labelledby="tickets-heading" className="space-y-4">
          <h2 id="tickets-heading" className="sr-only">
            Ticket List
          </h2>
          <TicketList
            tickets={ticketsData?.items || []}
            isLoading={isTicketsLoading}
            isError={isTicketsError}
            hasActiveFilters={hasActiveFilters}
            onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
            onResetFilters={handleResetFilters}
            onCreateTicket={() => setIsCreateOpen(true)}
          />

          {/* Pagination Controls */}
          <TicketPagination
            pagination={ticketsData?.pagination}
            onPageChange={handlePageChange}
            isLoading={isTicketsLoading}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        Support Ticket Dashboard • Powered by React, Express, Prisma & Neon PostgreSQL
      </footer>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitTicket={async (data) => {
          await createMutation.mutateAsync(data);
        }}
      />

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticketId={selectedTicketId}
        isOpen={!!selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        ticketData={selectedTicketData}
        isLoading={isDetailLoading}
        isError={isDetailError}
        onUpdateTicket={async (id, updates) => {
          await updateMutation.mutateAsync({ id, updates });
        }}
      />
    </div>
  );
}

export default App;
