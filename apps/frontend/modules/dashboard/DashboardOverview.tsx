'use client';

import { useEffect, useState } from 'react';
import { Activity, FileText, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCmsApi } from '@/hooks/useCmsApi';

interface DashboardStats {
  totalContent: number;
  draftContent: number;
  publishedContent: number;
  portfolioItems: number;
}

const statConfig = [
  { key: 'totalContent', title: 'Total Content', icon: FileText, color: 'bg-blue-500/10 text-blue-500' },
  { key: 'draftContent', title: 'Drafts', icon: Clock, color: 'bg-amber-500/10 text-amber-500' },
  { key: 'publishedContent', title: 'Published', icon: Activity, color: 'bg-emerald-500/10 text-emerald-500' },
  { key: 'portfolioItems', title: 'Portfolio Items', icon: AlertCircle, color: 'bg-violet-500/10 text-violet-500' },
] as const;

export function DashboardOverview() {
  const { request } = useCmsApi();
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    draftContent: 0,
    publishedContent: 0,
    portfolioItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const [allContent, draftContent, publishedContent, portfolioCount] = await Promise.all([
        request('/api/content'),
        request('/api/content?status=DRAFT'),
        request('/api/content?status=PUBLISHED'),
        request('/api/portfolio/projects'),
      ]);

      setStats({
        totalContent: Array.isArray(allContent) ? allContent.length : 0,
        draftContent: Array.isArray(draftContent) ? draftContent.length : 0,
        publishedContent: Array.isArray(publishedContent) ? publishedContent.length : 0,
        portfolioItems: Array.isArray(portfolioCount) ? portfolioCount.length : 0,
      });
      setIsLoading(false);
    };

    loadStats();
  }, [request]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your Portfolio CMS</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map(({ key, title, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-2 text-3xl font-bold">{stats[key]}</p>
                  )}
                </div>
                <div className={`rounded-lg p-2 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Content Status</p>
                <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
              </div>
              <Badge variant="outline">Updated</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Total Views</p>
                <p className="text-xs text-muted-foreground mt-0.5">Portfolio visits</p>
              </div>
              <Badge variant="outline">N/A</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-2 border-primary/30 pl-4">
              <p className="text-sm font-medium">CMS Initialized</p>
              <p className="text-xs text-muted-foreground mt-0.5">Just now</p>
            </div>
            <div className="border-l-2 border-border pl-4">
              <p className="text-sm font-medium">System ready</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ready to manage content</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
