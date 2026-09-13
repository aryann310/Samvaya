export interface CacheEntry<T> {
  data: T;
  retrievedAt: number;
  expiresAt: number;
}

export class CacheManager {
  private static store: Record<string, CacheEntry<any>> = {};

  static set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    const now = Date.now();
    this.store[key] = {
      data,
      retrievedAt: now,
      expiresAt: now + (ttlSeconds * 1000)
    };
  }

  static get<T>(key: string): CacheEntry<T> | null {
    const entry = this.store[key];
    if (!entry) return null;
    return entry as CacheEntry<T>;
  }

  static isValid(key: string): boolean {
    const entry = this.store[key];
    if (!entry) return false;
    return Date.now() < entry.expiresAt;
  }

  static getFreshness(retrievedAt: number, maxAgeMinutes: number): 'FRESH' | 'AGING' | 'STALE' | 'EXPIRED' {
    const ageMinutes = (Date.now() - retrievedAt) / (1000 * 60);
    if (ageMinutes < maxAgeMinutes * 0.25) return 'FRESH';
    if (ageMinutes < maxAgeMinutes * 0.75) return 'AGING';
    if (ageMinutes < maxAgeMinutes) return 'STALE';
    return 'EXPIRED';
  }
}
