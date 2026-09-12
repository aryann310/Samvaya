import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Business } from '../types';
import { getBusiness } from '../services/api';

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
  businessId: string;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// Default business ID for the demo kirana store
const DEFAULT_BUSINESS_ID = 'biz-001';

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBusiness(DEFAULT_BUSINESS_ID);
      setBusiness(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load business');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        error,
        refreshBusiness: fetchBusiness,
        businessId: DEFAULT_BUSINESS_ID,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextType {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
