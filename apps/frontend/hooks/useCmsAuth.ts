'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type CmsUser = {
  id: number;
  username: string;
  email: string;
};

export function useCmsAuth() {
  const router = useRouter();
  const [user, setUser] = useState<CmsUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem('cms-access-token');
      if (!accessToken) {
        setLoading(false);
        router.push('/cms/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        setUser(data.data);
        setToken(accessToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        sessionStorage.removeItem('cms-access-token');
        sessionStorage.removeItem('cms-refresh-token');
        router.push('/cms/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('cms-access-token');
    sessionStorage.removeItem('cms-refresh-token');
    setUser(null);
    setToken(null);
    router.push('/cms/login');
  }, [router]);

  return {
    user,
    token,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };
}
