'use client';

import { useCallback, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export function useCmsApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(
      endpoint: string,
      options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        body?: any;
        token?: string;
      } = {}
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const token =
          options.token || sessionStorage.getItem('cms-access-token');

        const response = await fetch(`${API_URL}${endpoint}`, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const data: ApiResponse<T> = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || `Request failed with status ${response.status}`
          );
        }

        return data.data || null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error };
}
