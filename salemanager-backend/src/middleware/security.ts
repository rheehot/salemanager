// Security Headers Middleware
import { Request, Response, NextFunction } from 'express';

/**
 * Security headers middleware
 * Adds security-related HTTP headers to all responses
 */
export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Enable XSS filter (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (basic)
  // Note: For API endpoints, we don't need strict CSP since we don't serve HTML
  // This is mainly for future frontend integration
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  // Permissions Policy (formerly Feature-Policy)
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HSTS (HTTP Strict Transport Security) - only in production with HTTPS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

/**
 * Cache control for API endpoints
 * Most API endpoints should not be cached by default
 */
export const noCacheHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

/**
 * Cache control for static assets
 */
export const staticCacheHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Cache for 1 year for immutable assets
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
};
