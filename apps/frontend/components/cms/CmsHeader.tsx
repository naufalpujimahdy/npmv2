'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const breadcrumbs: Record<string, string[]> = {
  '/cms':                            ['Dashboard'],
  '/cms/content':                    ['Content'],
  '/cms/content/new':                ['Content', 'New'],
  '/cms/portfolio/personal':         ['Portfolio', 'Personal Info'],
  '/cms/portfolio/projects':         ['Portfolio', 'Projects'],
  '/cms/portfolio/experience':       ['Portfolio', 'Experience'],
  '/cms/portfolio/education':        ['Portfolio', 'Education'],
  '/cms/portfolio/skills':           ['Portfolio', 'Skills'],
  '/cms/portfolio/certifications':   ['Portfolio', 'Certifications'],
  '/cms/portfolio/languages':        ['Portfolio', 'Languages'],
  '/cms/portfolio/testimonials':     ['Portfolio', 'Testimonials'],
  '/cms/settings':                   ['Settings'],
};

export function CmsHeader() {
  const pathname = usePathname();
  const crumbs = breadcrumbs[pathname] ?? ['CMS'];
  const [initials, setInitials] = useState('A');
  const [userLabel, setUserLabel] = useState('Admin');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cms-user');
      if (raw) {
        const user = JSON.parse(raw);
        const name: string = user?.name ?? user?.email ?? 'Admin';
        setUserLabel(name.split('@')[0]);
        setInitials(
          name
            .split(/[\s@]/)
            .filter(Boolean)
            .map((w: string) => w[0]?.toUpperCase())
            .slice(0, 2)
            .join('')
        );
      }
    } catch {}
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/40">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            <span
              className={
                i === crumbs.length - 1
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground'
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* User chip */}
      <div className="flex items-center gap-2.5">
        <span className="hidden text-xs text-muted-foreground sm:block">{userLabel}</span>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
