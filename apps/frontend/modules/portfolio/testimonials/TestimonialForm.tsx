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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCmsApi } from '@/hooks/useCmsApi';
import { ImageUpload } from '@/components/ui/image-upload';

interface Testimonial {
  id?: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  isVisible: boolean;
  order: number;
}

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TestimonialForm({ testimonial, onClose, onSuccess }: TestimonialFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Testimonial>(
    testimonial || {
      name: '',
      position: '',
      company: '',
      content: '',
      avatarUrl: '',
      linkedinUrl: '',
      isVisible: true,
      order: 0,
    }
  );

  const handleChange = (name: keyof Testimonial, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = testimonial?.id
        ? `/api/portfolio/testimonials/${testimonial.id}`
        : '/api/portfolio/testimonials';

      const result = await request(url, {
        method: testimonial?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        toast.success(testimonial?.id ? 'Testimoni berhasil diperbarui' : 'Testimoni berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan testimoni');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan testimoni');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{testimonial?.id ? 'Edit Testimoni' : 'Tambah Testimoni'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Posisi *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Perusahaan *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Testimoni *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <ImageUpload
              value={formData.avatarUrl || ''}
              onChange={(url) => handleChange('avatarUrl', url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              type="url"
              value={formData.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => handleChange('isVisible', Boolean(checked))}
            />
            <Label htmlFor="isVisible" className="cursor-pointer">Tampilkan di portfolio</Label>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
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
