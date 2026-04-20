'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Database,
  Globe,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Settings2,
  Shield,
  Sparkles,
} from 'lucide-react';

import { CmsSidebar } from '@/components/cms/CmsSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type CmsUser = {
  id: number;
  username: string;
  email: string;
};

type ContentEntry = {
  id: number;
  slug: string;
  title: string;
  type: string;
  status: string;
  updatedAt: string;
  section?: string | null;
};

type SiteSetting = {
  id: number;
  key: string;
  description?: string | null;
  updatedAt: string;
};

type DashboardState = {
  user: CmsUser | null;
  content: ContentEntry[];
  settings: SiteSetting[];
  token: string | null;
};

const initialState: DashboardState = {
  user: null,
  content: [],
  settings: [],
  token: null,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function CmsShell() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    const token =
      typeof window !== 'undefined' ? sessionStorage.getItem('cms-token') : null;

    if (!token) {
      setState(initialState);
      setLoading(false);
      router.push('/cms/login');
      return;
    }

    try {
      const [meResponse, contentResponse, settingsResponse] = await Promise.all([
        fetch(`${apiUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }),
        fetch(`${apiUrl}/api/content`, {
          cache: 'no-store',
        }),
        fetch(`${apiUrl}/api/settings`, {
          cache: 'no-store',
        }),
      ]);

      if (!meResponse.ok) {
        if (meResponse.status === 401 || meResponse.status === 403) {
          sessionStorage.removeItem('cms-token');
          sessionStorage.removeItem('cms-user');
          router.push('/cms/login');
          return;
        }
        throw new Error('Sesi login sudah tidak valid.');
      }

      const [mePayload, contentPayload, settingsPayload] = await Promise.all([
        meResponse.json() as Promise<{ data: CmsUser }>,
        contentResponse.json() as Promise<{ data: ContentEntry[] }>,
        settingsResponse.json() as Promise<{ data: SiteSetting[] }>,
      ]);

      setState({
        user: mePayload.data,
        content: contentPayload.data ?? [],
        settings: settingsPayload.data ?? [],
        token,
      });
    } catch (loadError) {
      setState(initialState);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Dashboard gagal dimuat.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  function logout() {
    sessionStorage.removeItem('cms-token');
    sessionStorage.removeItem('cms-user');
    router.push('/cms/login');
  }

  const publishedCount = state.content.filter(
    (item) => item.status === 'PUBLISHED'
  ).length;

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CmsSidebar />

        <section className="flex min-h-full flex-col gap-4">
          <Card className="overflow-hidden border-none bg-transparent shadow-none">
            <CardContent className="grid gap-4 p-0">
              <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,250,252,0.92))] p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <AvatarFallback>
                      {state.user?.username?.slice(0, 2) ?? 'CM'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="m-0 mt-1 text-2xl font-semibold tracking-tight">
                      {state.user
                        ? `Welcome back, ${state.user.username}`
                        : 'Dashboard'}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {state.user ? <Badge variant="outline">{state.user.email}</Badge> : null}
                  <Button variant="outline" onClick={() => void loadDashboard()}>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error ? (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="flex items-start gap-3 p-6 text-amber-900">
                <Shield className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="m-0 font-medium">Dashboard belum siap dipakai</p>
                  <p className="m-0 mt-1 text-sm leading-6">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,252,0.94))]">
                  <CardHeader>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </CardHeader>
                </Card>
              ))
            ) : (
              <>
                <MetricCard
                  icon={Database}
                  label="Total Konten"
                  value={String(state.content.length)}
                  detail="Total entries"
                />
                <MetricCard
                  icon={Sparkles}
                  label="Published"
                  value={String(publishedCount)}
                  detail="Live content"
                />
                <MetricCard
                  icon={Settings2}
                  label="Site Settings"
                  value={String(state.settings.length)}
                  detail="Global config"
                />
                <MetricCard
                  icon={Globe}
                  label="Admin Session"
                  value={state.user ? 'Active' : 'Missing'}
                  detail={state.user?.email ?? 'Not signed in'}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
            <Card id="content" className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,252,0.94))]">
              <CardHeader>
                <CardTitle>Konten terbaru</CardTitle>
                <CardDescription>Recent content entries</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : state.content.length === 0 ? (
                  <EmptyState
                    title="Belum ada konten"
                    description="Belum ada data untuk ditampilkan."
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.content.slice(0, 8).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-xs text-[var(--muted-foreground)]">
                                /{item.slug}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === 'PUBLISHED' ? 'success' : 'warning'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[var(--muted-foreground)]">
                            {formatDate(item.updatedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card id="settings" className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,252,0.94))]">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configuration keys</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : state.settings.length === 0 ? (
                    <EmptyState
                      title="Belum ada settings"
                      description="Belum ada konfigurasi yang tersimpan."
                    />
                  ) : (
                    state.settings.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[var(--border)] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{item.key}</span>
                          <Badge variant="outline">Config</Badge>
                        </div>
                        <p className="mb-0 mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                          {item.description || 'No description'}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card id="projects" className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,252,0.94))]">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>Recommended CMS improvements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TaskRow
                    title="Editor konten"
                    description="Form create/update untuk page, section, project, dan post."
                  />
                  <Separator />
                  <TaskRow
                    title="Protected routes"
                    description="Redirect otomatis jika token login belum ada atau sudah invalid."
                  />
                  <Separator />
                  <TaskRow
                    title="Publish workflow"
                    description="Draft, publish, archive, dan preview konten dari dashboard."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{label}</CardDescription>
          <div className="rounded-xl bg-[var(--accent)] p-2 text-[var(--accent-foreground)]">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="m-0 text-sm text-[var(--muted-foreground)]">{detail}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)]/40 px-6 text-center">
      <LoaderCircle className="mb-3 h-6 w-6 text-[var(--muted-foreground)]" />
      <p className="m-0 font-medium">{title}</p>
      <p className="m-0 mt-2 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function TaskRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="m-0 font-medium">{title}</p>
      <p className="m-0 mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
