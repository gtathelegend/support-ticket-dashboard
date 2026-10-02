export interface ErrorDetail {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: ErrorDetail[];

  constructor(
    statusCode: number,
    message: string,
    errorCode = 'BAD_REQUEST',
    details?: ErrorDetail[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: ErrorDetail[], errorCode = 'BAD_REQUEST') {
    return new ApiError(400, message, errorCode, details);
  }

  static validationError(message: string, details?: ErrorDetail[]) {
    return new ApiError(400, message, 'VALIDATION_ERROR', details);
  }

  static invalidId(message = 'Invalid ID format') {
    return new ApiError(400, message, 'INVALID_ID');
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
