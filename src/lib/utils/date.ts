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
 * Get current ISO string in a hydration-safe way
 */
export function getStableISOString(): string {
  if (typeof window === 'undefined') {
    return '2025-01-01T00:00:00.000Z';
  }
  return new Date().toISOString();
}

/**
 * Get stable timestamp for IDs or keys
 */
export function getStableId(): string {
  if (typeof window === 'undefined') {
    return 'ssr-stable-id';
  }
  return Date.now().toString();
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

/**
 * Generate stable random number for SSR
 */
export function getStableRandom(seed: string = 'default'): number {
  if (typeof window === 'undefined') {
    // Return deterministic "random" based on seed for SSR
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
  }
  return Math.random();
}