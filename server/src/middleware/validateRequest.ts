import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ApiError, ErrorDetail } from '../utils/apiError';

interface RequestValidationSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validateRequest = (schemas: RequestValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError || (error && (error as any).name === 'ZodError')) {
        const zodErr = error as ZodError;
        const details: ErrorDetail[] = (zodErr.errors || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const isIdError = (zodErr.errors || []).some((err) => err.path.includes('id'));
        const errorCode = isIdError ? 'INVALID_ID' : 'VALIDATION_ERROR';

        return next(
          new ApiError(
            400,
            isIdError ? 'Invalid ID format' : 'Invalid request payload or parameters',
            errorCode,
            details
          )
        );
      }
      return next(error);
    }
  };
};
