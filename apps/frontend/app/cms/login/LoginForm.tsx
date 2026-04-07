'use client';

import { useState, useTransition } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type LoginResult =
  | {
      token: string;
      user: {
        id: number;
        username: string;
        email: string;
      };
    }
  | null;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoginResult>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);

    const identifier = String(formData.get('identifier') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    startTransition(async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier, password }),
        });

        const payload = (await response.json()) as {
          ok?: boolean;
          error?: string;
          data?: LoginResult;
        };

        if (!response.ok || !payload.data) {
          setResult(null);
          setError(payload.error ?? 'Login gagal. Periksa kembali kredensial Anda.');
          return;
        }

        sessionStorage.setItem('cms-token', payload.data.token);
        sessionStorage.setItem('cms-user', JSON.stringify(payload.data.user));
        setResult(payload.data);
        window.location.href = '/cms';
      } catch {
        setResult(null);
        setError('Backend tidak bisa dijangkau. Pastikan server backend aktif.');
      }
    });
  }

  return (
    <Card className="w-full max-w-md overflow-hidden rounded-[32px] border-white/50 bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <form action={handleSubmit}>
        <CardContent className="flex flex-col justify-center gap-6 p-8 md:p-10">
          <div>
            <h1 className="m-0 text-3xl font-semibold tracking-tight">
              Sign in
            </h1>
            <p className="m-0 mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Masuk untuk mengelola konten.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Username atau email
              <Input
                name="identifier"
                placeholder="admin atau admin@email.com"
                autoComplete="username"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Password
              <Input
                type="password"
                name="password"
                placeholder="Minimal 8 karakter"
                autoComplete="current-password"
              />
            </label>
          </div>

          <Button type="submit" size="lg" disabled={isPending} className="w-full">
            {isPending ? 'Memproses...' : 'Masuk ke CMS'}
            <ArrowRight className="h-4 w-4" />
          </Button>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Login berhasil. Mengalihkan ke dashboard.
            </div>
          ) : null}
        </CardContent>
      </form>
    </Card>
  );
}
