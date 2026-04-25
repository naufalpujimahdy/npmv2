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

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  achievements?: string;
  institutionUrl?: string;
  order: number;
  isVisible: boolean;
}

interface EducationFormProps {
  education?: Education | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EducationForm({ education, onClose, onSuccess }: EducationFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Education>(
    education || {
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      gpa: '',
      description: '',
      achievements: '',
      institutionUrl: '',
      order: 0,
      isVisible: true,
    }
  );

  const handleChange = (name: keyof Education, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = education?.id
        ? `/api/portfolio/education/${education.id}`
        : '/api/portfolio/education';

      const result = await request(url, {
        method: education?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        toast.success(education?.id ? 'Pendidikan berhasil diperbarui' : 'Pendidikan berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan pendidikan');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan pendidikan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{education?.id ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institusi *</Label>
            <Input id="institution" value={formData.institution} onChange={(e) => handleChange('institution', e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Gelar *</Label>
              <Input id="degree" value={formData.degree} placeholder="e.g., Bachelor, Master" onChange={(e) => handleChange('degree', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Bidang Studi *</Label>
              <Input id="field" value={formData.field} onChange={(e) => handleChange('field', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" value={formData.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutionUrl">URL Institusi</Label>
            <Input id="institutionUrl" type="url" value={formData.institutionUrl || ''} onChange={(e) => handleChange('institutionUrl', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai *</Label>
              <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input id="endDate" type="date" value={formData.endDate || ''} onChange={(e) => handleChange('endDate', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input id="gpa" value={formData.gpa || ''} placeholder="e.g., 3.8/4.0" onChange={(e) => handleChange('gpa', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Pencapaian</Label>
            <Textarea id="achievements" value={formData.achievements || ''} onChange={(e) => handleChange('achievements', e.target.value)} rows={3} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isVisible" checked={formData.isVisible} onCheckedChange={(checked) => handleChange('isVisible', Boolean(checked))} />
            <Label htmlFor="isVisible" className="cursor-pointer">Tampilkan di portfolio</Label>
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
