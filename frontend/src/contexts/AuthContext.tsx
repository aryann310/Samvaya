import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axios from 'axios';

interface AuthUser {
  name: string;
  email: string;
  phone?: string;
  businessName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  businessId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'samvaya_auth';

function getStoredAuth(): { token: string; user: AuthUser; businessId: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth();
  const [token, setToken] = useState<string | null>(stored?.token || null);
  const [user, setUser] = useState<AuthUser | null>(stored?.user || null);
  const [businessId, setBusinessId] = useState<string | null>(stored?.businessId || null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify stored session on mount
  useEffect(() => {
    async function verify() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setBusinessId(data.data.businessId);
        } else {
          // Token invalid, clear
          logout();
        }
      } catch {
        // Server unreachable or token invalid – keep local state for demo resilience
        console.warn('[Auth] Could not verify token with server, keeping local session');
      } finally {
        setIsLoading(false);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (credentials: { email?: string; phone?: string; password: string }) => {
    const { data } = await axios.post('/api/auth/login', credentials);
    if (!data.success) {
      throw new Error(data.error || 'Login failed');
    }
    const { token: newToken, businessId: newBizId, user: newUser } = data.data;
    setToken(newToken);
    setUser(newUser);
    setBusinessId(newBizId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser, businessId: newBizId }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setBusinessId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        businessId,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
