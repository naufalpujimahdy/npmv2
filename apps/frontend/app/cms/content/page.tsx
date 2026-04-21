'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { CmsSidebar } from '@/components/cms/CmsSidebar';
import { ContentManager } from '@/components/cms/ContentManager';

export default function ContentPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('cms-access-token');
    if (!token) {
      router.push('/cms/login');
    } else {
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CmsSidebar />
        <main className="overflow-auto">
          <ContentManager />
        </main>
      </div>
    </div>
  );
}
