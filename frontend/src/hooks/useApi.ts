import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for API calls with loading/error state management.
 * Simulates a brief loading delay for realistic UX (skeleton loaders).
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Brief delay for realistic loading state UX
      const [result] = await Promise.all([
        fetcher(),
        new Promise((resolve) => setTimeout(resolve, 300)),
      ]);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Format a number as Indian Rupees with proper grouping (₹1,20,000)
 */
export function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    return `${isNegative ? '-' : ''}₹${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    return `${isNegative ? '-' : ''}₹${(absAmount / 100000).toFixed(2)} L`;
  }

  // Indian number formatting: 1,20,000
  const formatted = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR',
  });

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format percentage with sign
 */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Format a compact number (e.g., 1.2K, 3.5L)
 */
export function formatCompact(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
  return value.toString();
}
