'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCmsApi } from '@/hooks/useCmsApi';

interface ContentFormProps {
  id?: string;
  isNew?: boolean;
}

export function ContentForm({ id, isNew }: ContentFormProps) {
  const router = useRouter();
  const { request, loading } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    type: 'ARTICLE',
    status: 'DRAFT',
  });

  useEffect(() => {
    if (id && !isNew) {
      const loadContent = async () => {
        // Load content from API
        const data = await request(`/api/content/${id}`);
        if (data) {
          setForm(data as any);
        }
      };
      loadContent();
    }
  }, [id, isNew, request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isNew) {
        await request('/api/content', {
          method: 'POST',
          body: form,
        });
      } else if (id) {
        await request(`/api/content/${id}`, {
          method: 'PUT',
          body: form,
        });
      }

      router.push('/cms/content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Create Content' : 'Edit Content'}
          </h1>
          <p className="text-gray-600">
            {isNew ? 'Add new content to your portfolio' : 'Update your content'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Content title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="content-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Your content here..."
                className="h-64 w-full rounded-md border border-gray-200 p-3 font-mono text-sm"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2"
                >
                  <option>ARTICLE</option>
                  <option>PAGE</option>
                  <option>SNIPPET</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2"
                >
                  <option>DRAFT</option>
                  <option>PUBLISHED</option>
                  <option>ARCHIVED</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6">
              <div className="flex gap-2">
                <Badge variant="outline">{form.type}</Badge>
                <Badge
                  className={
                    form.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {form.status}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || loading}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isNew ? 'Create' : 'Save'} Content
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
