// Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include userId
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Get JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Verify JWT token and attach user info to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: '토큰이 제공되지 않았습니다',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: '토큰이 만료되었습니다',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '인증 처리 중 오류가 발생했습니다',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that work both with and without auth
 */
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.userId = decoded.userId;
        req.userRole = decoded.role;
      }
    }

    next();
  } catch {
    // Silently continue on error for optional auth
    next();
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!allowedRoles.includes(req.userRole || '')) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: '접근 권한이 없습니다',
          timestamp: new Date().toISOString(),
        },
      });
    }

    next();
  };
};

// Export JWT configuration for use in auth service
export const JWT_CONFIG = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
};
