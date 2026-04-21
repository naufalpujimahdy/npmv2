'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCmsApi } from '@/hooks/useCmsApi';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalContent: number;
  draftContent: number;
  publishedContent: number;
  portfolioItems: number;
}

export function DashboardOverview() {
  const { request, loading } = useCmsApi();
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
      const [allContent, draftContent, publishedContent] = await Promise.all([
        request('/api/content'),
        request('/api/content?status=DRAFT'),
        request('/api/content?status=PUBLISHED'),
      ]);

      const portfolioCount = (await request('/api/portfolio/projects')) as any[];

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

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-12" />
            ) : (
              <p className="mt-2 text-3xl font-bold">{value}</p>
            )}
          </div>
          <div className={`rounded-lg p-2 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Portfolio CMS</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          title="Total Content"
          value={stats.totalContent}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={Clock}
          title="Draft Content"
          value={stats.draftContent}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          icon={Activity}
          title="Published"
          value={stats.publishedContent}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={AlertCircle}
          title="Portfolio Items"
          value={stats.portfolioItems}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="font-medium">Content Status</p>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              <Badge variant="outline">Updated</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="font-medium">Total Views</p>
                <p className="text-sm text-gray-600">Portfolio visits</p>
              </div>
              <Badge variant="outline">N/A</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="font-medium">CMS Initialized</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="font-medium">System ready</p>
                <p className="text-sm text-gray-600">Ready to manage content</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
