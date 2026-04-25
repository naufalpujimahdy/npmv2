'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Skill {
  id?: string;
  name: string;
  category: string;
  proficiency: string;
  iconUrl?: string;
  order: number;
  isVisible: boolean;
}

interface SkillFormProps {
  skill?: Skill | null;
  onClose: () => void;
  onSuccess: () => void;
}

const proficiencyLevels = [
  { value: 'Expert', label: 'Ahli' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Intermediate', label: 'Menengah' },
  { value: 'Beginner', label: 'Pemula' },
];

const categories = [
  'Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Design', 'Mobile', 'Other',
];

export function SkillForm({ skill, onClose, onSuccess }: SkillFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Skill>(
    skill || {
      name: '',
      category: 'Frontend',
      proficiency: 'Intermediate',
      iconUrl: '',
      order: 0,
      isVisible: true,
    }
  );

  const handleChange = (name: keyof Skill, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = skill?.id
        ? `/api/portfolio/skills/${skill.id}`
        : '/api/portfolio/skills';

      const result = await request(url, {
        method: skill?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        toast.success(skill?.id ? 'Keahlian berhasil diperbarui' : 'Keahlian berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan keahlian');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan keahlian');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{skill?.id ? 'Edit Keahlian' : 'Tambah Keahlian'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Keahlian *</Label>
            <Input
              id="name"
              value={formData.name}
              placeholder="e.g., React, Python"
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Kategori *</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => handleChange('category', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tingkat Keahlian *</Label>
            <Select
              value={formData.proficiency}
              onValueChange={(val) => handleChange('proficiency', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconUrl">Icon URL</Label>
            <Input
              id="iconUrl"
              type="url"
              value={formData.iconUrl || ''}
              onChange={(e) => handleChange('iconUrl', e.target.value)}
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
