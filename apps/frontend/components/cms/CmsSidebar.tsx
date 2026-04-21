'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { href: '/cms', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cms/content', label: 'Content', icon: FileText },
  { href: '/cms/portfolio', label: 'Portfolio', icon: FolderKanban },
  { href: '/cms/settings', label: 'Settings', icon: Settings },
];

export function CmsSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('cms-access-token');
    sessionStorage.removeItem('cms-refresh-token');
    if (typeof window !== 'undefined') {
      window.location.href = '/cms/login';
    }
  };

  return (
    <aside className="flex h-full flex-col rounded-[28px] border border-[var(--sidebar-border)] bg-[var(--sidebar)] px-5 py-6 text-[var(--sidebar-foreground)]">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--sidebar-primary)]/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="m-0 text-lg font-semibold">Content Studio</h2>
          <p className="m-0 text-sm text-white/60">Portfolio CMS</p>
        </div>
      </div>

      <Separator className="my-6 bg-white/10" />

      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-[var(--sidebar-accent)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'text-white/72 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2">
        <Button
          variant="secondary"
          className="w-full border border-white/10 bg-white/8 text-white hover:bg-white/14"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
        >
          View site
        </Button>
        <Button
          variant="ghost"
          className="w-full gap-2 text-white/72 hover:bg-white/8 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
