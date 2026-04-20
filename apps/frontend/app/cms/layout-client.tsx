'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function CmsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('cms-access-token');
    
    if (!token) {
      router.push('/cms/login');
      return;
    }

    // Optional: Validate token format (basic JWT check)
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        sessionStorage.removeItem('cms-access-token');
        sessionStorage.removeItem('cms-refresh-token');
        sessionStorage.removeItem('cms-user');
        router.push('/cms/login');
      }
    } catch {
      sessionStorage.removeItem('cms-access-token');
      sessionStorage.removeItem('cms-refresh-token');
      sessionStorage.removeItem('cms-user');
      router.push('/cms/login');
    }
  }, [router]);

  return <>{children}</>;
}
