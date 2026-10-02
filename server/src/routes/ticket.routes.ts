import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicketSummary,
  getTicketById,
  updateTicket,
} from '../controllers/ticket.controller';
import { validateRequest } from '../middleware/validateRequest';
import {
  createTicketSchema,
  updateTicketSchema,
  ticketQuerySchema,
  ticketParamsSchema,
} from '../validations/ticket.validation';

const router = Router();

// POST /api/tickets - Create a new ticket
router.post(
  '/',
  validateRequest({ body: createTicketSchema }),
  createTicket
);

// GET /api/tickets - List tickets with search, filtering, sorting, pagination
router.get(
  '/',
  validateRequest({ query: ticketQuerySchema }),
  getTickets
);

// GET /api/tickets/summary - Unfiltered aggregate ticket counts
router.get('/summary', getTicketSummary);

// GET /api/tickets/:id - Get single ticket details by UUID
router.get(
  '/:id',
  validateRequest({ params: ticketParamsSchema }),
  getTicketById
);

// PATCH /api/tickets/:id - Update ticket status and/or priority
router.patch(
  '/:id',
  validateRequest({
    params: ticketParamsSchema,
    body: updateTicketSchema,
  }),
  updateTicket
);

export default router;
