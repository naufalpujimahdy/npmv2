'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export function CmsLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (pathname === '/cms/login') {
      setIsReady(true);
      return;
    }

    const token = sessionStorage.getItem('cms-access-token');
    if (!token) {
      router.push('/cms/login');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('invalid');
      setIsReady(true);
    } catch {
      sessionStorage.removeItem('cms-access-token');
      sessionStorage.removeItem('cms-refresh-token');
      sessionStorage.removeItem('cms-user');
      router.push('/cms/login');
    }
  }, [router, pathname]);

  if (!isReady) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Content Studio</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Verifying session…</p>
          </div>
        </div>

        {/* Spinner */}
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
