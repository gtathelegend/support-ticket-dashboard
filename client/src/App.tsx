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
import { Plus, HeartHandshake } from 'lucide-react';

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

  const totalTickets = ticketsData?.pagination?.totalItems;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── App Shell Header ── */}
      <header className="bg-white border-b border-[#DFE1E6] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          {/* Logo / Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <HeartHandshake
              className="w-4 h-4 text-[#0C66E4]"
              aria-hidden="true"
            />
            <span className="text-[14px] font-bold tracking-tight text-[#172B4D]">
              SupportDesk
            </span>
            <span className="hidden sm:inline-block text-[#C1C7D0] mx-1">·</span>
            <span className="hidden sm:inline-block text-[13px] text-[#5E6C84]">
              Ticket Operations
            </span>
          </div>

          {/* Create button */}
          <Button
            id="create-ticket-btn"
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="shrink-0"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Create ticket
          </Button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Metric Summary Row */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">Summary metrics</h2>
          <TicketSummaryCards
            summary={summaryData}
            isLoading={isSummaryLoading}
            isError={isSummaryError}
          />
        </section>

        {/* Main Panel: filter bar + table */}
        <section
          aria-labelledby="tickets-heading"
          className="bg-white border border-[#DFE1E6] rounded-[6px] overflow-hidden"
          style={{ boxShadow: '0 1px 2px rgba(9, 30, 66, 0.06)' }}
        >
          {/* Panel toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[#DFE1E6]">
            <div className="flex items-center gap-2">
              <h2 id="tickets-heading" className="text-[13px] font-semibold text-[#172B4D]">
                Tickets
              </h2>
              {totalTickets !== undefined && !isTicketsLoading && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-[#F7F8FA] border border-[#DFE1E6] text-[11px] font-semibold text-[#5E6C84] rounded-full">
                  {totalTickets}
                </span>
              )}
            </div>
          </div>

          {/* Filter bar */}
          <div className="px-4 py-2.5 border-b border-[#DFE1E6] bg-[#FAFBFC]">
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
          </div>

          {/* Ticket table / empty state */}
          <TicketList
            tickets={ticketsData?.items || []}
            isLoading={isTicketsLoading}
            isError={isTicketsError}
            hasActiveFilters={hasActiveFilters}
            onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
            onResetFilters={handleResetFilters}
            onCreateTicket={() => setIsCreateOpen(true)}
          />

          {/* Pagination */}
          <TicketPagination
            pagination={ticketsData?.pagination}
            onPageChange={handlePageChange}
            isLoading={isTicketsLoading}
          />
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#DFE1E6] py-3 text-center text-[11px] text-[#7A869A]">
        SupportDesk · React · Express · Prisma · Neon PostgreSQL
      </footer>

      {/* ── Modals ── */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitTicket={async (data) => {
          await createMutation.mutateAsync(data);
        }}
      />

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
