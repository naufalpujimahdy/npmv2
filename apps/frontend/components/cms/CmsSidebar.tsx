'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  User,
  Briefcase,
  BookOpen,
  Award,
  Code2,
  Languages,
  MessageSquare,
  FolderOpen,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const portfolioItems = [
  { href: '/cms/portfolio/personal', label: 'Personal Info', icon: User },
  { href: '/cms/portfolio/projects', label: 'Projects', icon: FolderOpen },
  { href: '/cms/portfolio/experience', label: 'Experience', icon: Briefcase },
  { href: '/cms/portfolio/education', label: 'Education', icon: BookOpen },
  { href: '/cms/portfolio/skills', label: 'Skills', icon: Code2 },
  { href: '/cms/portfolio/certifications', label: 'Certifications', icon: Award },
  { href: '/cms/portfolio/languages', label: 'Languages', icon: Languages },
  { href: '/cms/portfolio/testimonials', label: 'Testimonials', icon: MessageSquare },
];

export function CmsSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isPortfolioSection = pathname.startsWith('/cms/portfolio');
  const [portfolioOpen, setPortfolioOpen] = useState(isPortfolioSection);

  const handleLogout = () => {
    sessionStorage.removeItem('cms-access-token');
    sessionStorage.removeItem('cms-refresh-token');
    sessionStorage.removeItem('cms-user');
    window.location.href = '/cms/login';
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

  const navLink = (href: string, label: string, Icon: React.ElementType, exact = false) => {
    const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-(--sidebar-accent) text-white'
            : 'text-white/55 hover:bg-white/8 hover:text-white'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </Link>
    );
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-(--sidebar) text-(--sidebar-foreground)">

      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b border-(--sidebar-border) px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--sidebar-primary)/25">
          <ShieldCheck className="h-3.5 w-3.5 text-(--sidebar-primary)" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Content Studio</p>
          <p className="text-[10px] leading-tight text-white/40">Portfolio CMS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Overview
        </p>

        {navLink('/cms', 'Dashboard', LayoutDashboard, true)}

        <div className="mt-3">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Portfolio
          </p>

          {/* Portfolio group toggle */}
          <button
            onClick={() => setPortfolioOpen((o) => !o)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isPortfolioSection
                ? 'text-white'
                : 'text-white/55 hover:bg-white/8 hover:text-white'
            )}
          >
            <FolderKanban className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Sections</span>
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform duration-200', portfolioOpen && 'rotate-180')}
            />
          </button>

          {portfolioOpen && (
            <div className="mt-0.5 ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
              {portfolioItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                    pathname === href
                      ? 'bg-(--sidebar-accent) text-white'
                      : 'text-white/50 hover:bg-white/8 hover:text-white'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Manage
          </p>
          {navLink('/cms/content', 'Content', FileText)}
          {navLink('/cms/settings', 'Settings', Settings)}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-(--sidebar-border) p-3 space-y-0.5">
        <button
          onClick={cycleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ThemeIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{themeLabel} Mode</span>
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          View Site
        </a>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/8 hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
