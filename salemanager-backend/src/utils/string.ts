// String utilities for input sanitization

/**
 * Escapes LIKE wildcards in search strings to prevent SQL injection
 * in Prisma queries using the `contains` operator.
 *
 * This prevents users from using % and _ wildcards to manipulate
 * search results or cause performance issues.
 *
 * @param input - The raw search input string
 * @returns The sanitized string with wildcards escaped
 *
 * @example
 * sanitizeSearchInput('test%product') // returns 'test\\%product'
 * sanitizeSearchInput('user_data')   // returns 'user\\_data'
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')    // Escape LIKE wildcard %
    .replace(/_/g, '\\_');   // Escape LIKE wildcard _
}

/**
 * Trims and sanitizes search input for database queries
 *
 * @param input - The raw search input
 * @returns Trimmed and sanitized string, or empty string if input is falsy
 */
export function cleanSearchInput(input?: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return sanitizeSearchInput(input.trim());
}

/**
 * Validates that a string length is within bounds
 *
 * @param input - The string to validate
 * @param minLength - Minimum allowed length (default: 1)
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns true if valid, false otherwise
 */
export function isValidLength(
  input: string,
  minLength: number = 1,
  maxLength: number = 1000
): boolean {
  if (typeof input !== 'string') return false;
  const trimmed = input.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Removes potentially dangerous characters from strings
 * while preserving basic content
 *
 * @param input - The string to clean
 * @returns Cleaned string
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}
