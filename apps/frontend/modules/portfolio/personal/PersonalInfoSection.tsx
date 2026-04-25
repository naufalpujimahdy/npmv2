'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCmsApi } from '@/hooks/useCmsApi';
import { ImageUpload } from '@/components/ui/image-upload';

interface PersonalInfo {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  updatedAt: string;
}

export function PersonalInfoSection() {
  const { request } = useCmsApi();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo | null>(null);

  const loadPersonalInfo = useCallback(async () => {
    setIsLoading(true);
    const data = await request<PersonalInfo>('/api/portfolio/personal');
    if (data) {
      setPersonalInfo(data);
      setFormData(data);
    }
    setIsLoading(false);
  }, [request]);

  useEffect(() => { loadPersonalInfo(); }, [loadPersonalInfo]);

  const handleChange = (name: keyof PersonalInfo, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      const result = await request('/api/portfolio/personal', {
        method: personalInfo ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        setPersonalInfo(formData);
        toast.success('Informasi pribadi berhasil disimpan');
      } else {
        toast.error('Gagal menyimpan informasi pribadi');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!formData) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada data informasi pribadi
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Informasi Dasar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Gelar / Profesi</Label>
            <Input id="title" value={formData.title} placeholder="e.g., Full Stack Developer" onChange={(e) => handleChange('title', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={4} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kontak</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" type="tel" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" value={formData.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>URL & Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Avatar</Label>
            <ImageUpload
              value={formData.avatarUrl || ''}
              onChange={(url) => handleChange('avatarUrl', url)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input id="resumeUrl" type="url" value={formData.resumeUrl || ''} onChange={(e) => handleChange('resumeUrl', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" type="url" value={formData.linkedinUrl || ''} onChange={(e) => handleChange('linkedinUrl', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" type="url" value={formData.githubUrl || ''} onChange={(e) => handleChange('githubUrl', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" type="url" value={formData.websiteUrl || ''} onChange={(e) => handleChange('websiteUrl', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => setFormData(personalInfo)}>Batal</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
