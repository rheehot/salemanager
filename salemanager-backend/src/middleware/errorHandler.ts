// Error Handler Middleware
import { Request, Response, NextFunction } from 'express';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp?: string;
}

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Default error response
  const statusCode = 500;
  const apiError: ApiError = {
    code: 'INTERNAL_SERVER_ERROR',
    message: '서버 오류가 발생했습니다',
    timestamp: new Date().toISOString(),
  };

  // Prisma errors
  if (err.message.includes('Record to update not found')) {
    apiError.code = 'NOT_FOUND';
    apiError.message = '리소스를 찾을 수 없습니다';
    return res.status(404).json({ error: apiError });
  }

  if (err.message.includes('Unique constraint')) {
    apiError.code = 'DUPLICATE_ERROR';
    apiError.message = '이미 존재하는 데이터입니다';
    return res.status(409).json({ error: apiError });
  }

  res.status(statusCode).json({ error: apiError });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `'${req.method} ${req.path}' 엔드포인트를 찾을 수 없습니다`,
      timestamp: new Date().toISOString(),
    },
  });
};
