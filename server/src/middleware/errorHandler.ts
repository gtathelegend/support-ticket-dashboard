import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Known ApiError or ApiError-like objects
  if (err instanceof ApiError || (err && typeof (err as any).statusCode === 'number')) {
    const apiErr = err as ApiError;
    const statusCode = apiErr.statusCode || 400;
    const errorCode = apiErr.errorCode || 'BAD_REQUEST';
    const details = apiErr.details;

    return res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: apiErr.message,
        ...(details && details.length > 0 && { details }),
      },
    });
  }

  // Zod Validation Error Fallback
  if (err instanceof ZodError || (err && (err as any).name === 'ZodError')) {
    const zodErr = err as ZodError;
    const details = (zodErr.errors || []).map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    const isIdError = (zodErr.errors || []).some((e) => e.path.includes('id'));

    return res.status(400).json({
      success: false,
      error: {
        code: isIdError ? 'INVALID_ID' : 'VALIDATION_ERROR',
        message: isIdError ? 'Invalid ID format' : 'Invalid request payload or parameters',
        details,
      },
    });
  }

  // Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'The requested ticket record was not found.',
        },
      });
    }

    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'A record with this unique constraint already exists.',
        },
      });
    }

    console.error('Prisma Error:', err.code, err.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'A database error occurred while processing your request.',
      },
    });
  }

  // Unhandled / Unexpected Server Errors
  console.error('Unhandled Error:', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    },
  });
};
