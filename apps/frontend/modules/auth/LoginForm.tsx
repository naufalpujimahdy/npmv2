'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: { id: number; username: string; email: string };
} | null;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = sessionStorage.getItem('cms-access-token');

      if (!accessToken) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
          router.push('/cms');
          return;
        }

        sessionStorage.removeItem('cms-access-token');
        sessionStorage.removeItem('cms-refresh-token');
        sessionStorage.removeItem('cms-user');
      } catch {
        sessionStorage.removeItem('cms-access-token');
        sessionStorage.removeItem('cms-refresh-token');
        sessionStorage.removeItem('cms-user');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const identifier = String(formData.get('identifier') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    startTransition(async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        });

        const payload = (await response.json()) as {
          ok?: boolean;
          error?: string;
          data?: LoginResult;
        };

        if (!response.ok || !payload.data) {
          const msg = payload.error ?? 'Login gagal. Periksa kembali kredensial Anda.';
          setError(msg);
          toast.error(msg);
          return;
        }

        sessionStorage.setItem('cms-access-token', payload.data.accessToken);
        sessionStorage.setItem('cms-refresh-token', payload.data.refreshToken);
        sessionStorage.setItem('cms-user', JSON.stringify(payload.data.user));
        toast.success(`Selamat datang, ${payload.data.user.username}!`);
        window.location.href = '/cms';
      } catch {
        const msg = 'Backend tidak bisa dijangkau. Pastikan server backend aktif.';
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <>
      <Toaster />
      <Card className="w-full max-w-md overflow-hidden rounded-4xl border-white/50 bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        {isCheckingAuth ? (
          <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Memeriksa status login...</p>
          </CardContent>
        ) : (
          <form action={handleSubmit}>
            <CardContent className="flex flex-col gap-6 p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Content Studio</h1>
                  <p className="text-xs text-muted-foreground">Portfolio CMS</p>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Masuk</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Masuk untuk mengelola konten portfolio Anda.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Username atau Email</Label>
                  <Input
                    id="identifier"
                    name="identifier"
                    placeholder="admin atau admin@email.com"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Minimal 8 karakter"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button type="submit" size="lg" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {isPending ? 'Memproses...' : 'Masuk ke CMS'}
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </>
  );
}
