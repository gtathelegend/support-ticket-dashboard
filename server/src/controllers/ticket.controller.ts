import { Request, Response } from 'express';
import { ticketService } from '../services/ticket.service';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await ticketService.createTicket(req.body);
  return res.status(201).json({
    success: true,
    data: ticket,
  });
});

export const getTickets = asyncHandler(async (req: Request, res: Response) => {
  const result = await ticketService.getTickets(req.query as any);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTicketSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await ticketService.getTicketSummary();
  return res.status(200).json({
    success: true,
    data: summary,
  });
});

export const getTicketById = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await ticketService.getTicketById(req.params.id);
  if (!ticket) {
    throw ApiError.notFound(`Ticket with ID ${req.params.id} was not found.`);
  }
  return res.status(200).json({
    success: true,
    data: ticket,
  });
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const updatedTicket = await ticketService.updateTicket(req.params.id, req.body);
  if (!updatedTicket) {
    throw ApiError.notFound(`Ticket with ID ${req.params.id} was not found.`);
  }
  return res.status(200).json({
    success: true,
    data: updatedTicket,
  });
});
