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
import { SkillMultiSelect } from '@/components/ui/skill-multi-select';

interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string;
  technologies?: string;
  companyUrl?: string;
  order: number;
  isVisible: boolean;
}

interface ExperienceFormProps {
  experience?: Experience | null;
  onClose: () => void;
  onSuccess: () => void;
}

const toDateInput = (val?: string | null) =>
  val ? new Date(val).toISOString().split('T')[0] : '';

export function ExperienceForm({ experience, onClose, onSuccess }: ExperienceFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Experience>(
    experience
      ? { ...experience, startDate: toDateInput(experience.startDate), endDate: toDateInput(experience.endDate) }
      : {
          company: '',
          position: '',
          location: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          isCurrent: true,
          description: '',
          achievements: '',
          technologies: '',
          companyUrl: '',
          order: 0,
          isVisible: true,
        }
  );

  const handleChange = (name: keyof Experience, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = experience?.id
        ? `/api/portfolio/experience/${experience.id}`
        : '/api/portfolio/experience';

      const result = await request(url, {
        method: experience?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        toast.success(experience?.id ? 'Pengalaman berhasil diperbarui' : 'Pengalaman berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan pengalaman kerja');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan pengalaman');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{experience?.id ? 'Edit Pengalaman' : 'Tambah Pengalaman Kerja'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Perusahaan *</Label>
              <Input id="company" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Posisi *</Label>
              <Input id="position" value={formData.position} onChange={(e) => handleChange('position', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" value={formData.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyUrl">URL Perusahaan</Label>
            <Input id="companyUrl" type="url" value={formData.companyUrl || ''} onChange={(e) => handleChange('companyUrl', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai *</Label>
              <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Berakhir</Label>
              <Input id="endDate" type="date" value={formData.endDate || ''} onChange={(e) => handleChange('endDate', e.target.value)} disabled={formData.isCurrent} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="isCurrent" checked={formData.isCurrent} onCheckedChange={(checked) => handleChange('isCurrent', Boolean(checked))} />
            <Label htmlFor="isCurrent" className="cursor-pointer">Saat ini bekerja di sini</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Pencapaian</Label>
            <Textarea id="achievements" value={formData.achievements || ''} onChange={(e) => handleChange('achievements', e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Teknologi</Label>
            <SkillMultiSelect
              value={formData.technologies || ''}
              onChange={(val) => handleChange('technologies', val)}
            />
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
