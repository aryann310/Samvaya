import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Business } from '../types';
import { getBusiness } from '../services/api';
import { useAuth } from './AuthContext';

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
  businessId: string;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { businessId: authBusinessId } = useAuth();
  const businessId = authBusinessId || 'biz-001';

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBusiness(businessId);
      setBusiness(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load business');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

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
        businessId,
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
