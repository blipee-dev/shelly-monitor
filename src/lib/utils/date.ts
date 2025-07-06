// Utility functions for hydration-safe date handling

/**
 * Get current year in a hydration-safe way
 * Returns a stable value during SSR and updates on client
 */
export function getCurrentYear(): number {
  if (typeof window === 'undefined') {
    // Return a stable year during SSR
    return new Date('2025-01-01').getFullYear();
  }
  return new Date().getFullYear();
}

/**
 * Get current date in a hydration-safe way
 * Returns a stable date during SSR
 */
export function getStableDate(): Date {
  if (typeof window === 'undefined') {
    // Return a stable date during SSR
    return new Date('2025-01-01T00:00:00Z');
  }
  return new Date();
}

/**
 * Format a date in a hydration-safe way
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Use a stable locale during SSR
  const locale = typeof window === 'undefined' ? 'en-US' : navigator.language;
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get timestamp in a hydration-safe way
 */
export function getStableTimestamp(): number {
  if (typeof window === 'undefined') {
    // Return a stable timestamp during SSR
    return new Date('2025-01-01T00:00:00Z').getTime();
  }
  return Date.now();
}