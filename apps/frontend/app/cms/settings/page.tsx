'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { CmsSidebar } from '@/components/cms/CmsSidebar';

export default function SettingsPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'My Portfolio',
    siteDescription: 'Personal portfolio website',
    email: 'hello@example.com',
    phone: '+1 (555) 123-4567',
  });

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

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CmsSidebar />
        <main className="overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-600">Manage your site settings</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site Name</label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                      placeholder="Your site name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site Description</label>
                    <Input
                      value={settings.siteDescription}
                      onChange={(e) => handleChange('siteDescription', e.target.value)}
                      placeholder="Your site description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>

                  <Button className="mt-4">Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">API key management coming soon</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
