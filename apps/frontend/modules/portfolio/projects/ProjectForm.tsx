'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCmsApi } from '@/hooks/useCmsApi';

interface Project {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  technologies?: string;
  images?: string;
  demoUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  status?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  isVisible?: boolean;
}

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions = [
  { value: 'completed', label: 'Selesai' },
  { value: 'in-progress', label: 'Sedang Dikerjakan' },
  { value: 'planned', label: 'Direncanakan' },
];

const toDateInput = (val?: string | null) =>
  val ? new Date(val).toISOString().split('T')[0] : '';

export function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    description: project?.description ?? '',
    longDescription: project?.longDescription ?? '',
    technologies: project?.technologies ?? '',
    images: project?.images ?? '',
    demoUrl: project?.demoUrl ?? '',
    sourceUrl: project?.sourceUrl ?? '',
    featured: project?.featured ?? false,
    status: project?.status ?? 'completed',
    startDate: toDateInput(project?.startDate),
    endDate: toDateInput(project?.endDate),
    order: project?.order ?? 0,
    isVisible: project?.isVisible ?? true,
  });

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = project?.id ? `/api/portfolio/projects/${project.id}` : '/api/portfolio/projects';
      const result = await request(url, {
        method: project?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        toast.success(project?.id ? 'Proyek berhasil diperbarui' : 'Proyek berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan proyek');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan proyek');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project?.id ? 'Edit Proyek' : 'Tambah Proyek'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Proyek *</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input id="slug" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} required />
              <Button type="button" variant="outline" onClick={handleGenerateSlug}>Generate</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Singkat *</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={2} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Deskripsi Lengkap</Label>
            <Textarea id="longDescription" value={formData.longDescription || ''} onChange={(e) => handleChange('longDescription', e.target.value)} rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Teknologi (dipisahkan koma) *</Label>
            <Textarea id="technologies" value={formData.technologies} onChange={(e) => handleChange('technologies', e.target.value)} rows={2} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">URL Gambar (dipisahkan koma)</Label>
            <Textarea id="images" value={formData.images} onChange={(e) => handleChange('images', e.target.value)} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input id="demoUrl" type="url" value={formData.demoUrl || ''} onChange={(e) => handleChange('demoUrl', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">Source Code URL</Label>
              <Input id="sourceUrl" type="url" value={formData.sourceUrl || ''} onChange={(e) => handleChange('sourceUrl', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input id="startDate" type="date" value={formData.startDate || ''} onChange={(e) => handleChange('startDate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input id="endDate" type="date" value={formData.endDate || ''} onChange={(e) => handleChange('endDate', e.target.value)} />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => handleChange('featured', Boolean(checked))} />
              <Label htmlFor="featured" className="cursor-pointer">Proyek Unggulan</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="isVisible" checked={formData.isVisible} onCheckedChange={(checked) => handleChange('isVisible', Boolean(checked))} />
              <Label htmlFor="isVisible" className="cursor-pointer">Tampilkan di portfolio</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
