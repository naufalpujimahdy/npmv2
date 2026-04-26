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

interface Language {
  id?: string;
  name: string;
  proficiency: string;
  order: number;
  isVisible: boolean;
}

interface LanguageFormProps {
  language?: Language | null;
  onClose: () => void;
  onSuccess: () => void;
}

const proficiencyLevels = [
  { value: 'Native', label: 'Native' },
  { value: 'Fluent', label: 'Fasih' },
  { value: 'Conversational', label: 'Percakapan' },
  { value: 'Basic', label: 'Dasar' },
];

export function LanguageForm({ language, onClose, onSuccess }: LanguageFormProps) {
  const { request } = useCmsApi();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Language>(
    language || {
      name: '',
      proficiency: 'Conversational',
      order: 0,
      isVisible: true,
    }
  );

  const handleChange = (name: keyof Language, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = language?.id
        ? `/api/portfolio/languages/${language.id}`
        : '/api/portfolio/languages';

      const result = await request(url, {
        method: language?.id ? 'PUT' : 'POST',
        body: formData,
      });

      if (result) {
        toast.success(language?.id ? 'Bahasa berhasil diperbarui' : 'Bahasa berhasil ditambahkan');
        onSuccess();
      } else {
        toast.error('Gagal menyimpan bahasa');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan bahasa');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{language?.id ? 'Edit Bahasa' : 'Tambah Bahasa'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Bahasa *</Label>
            <Input
              id="name"
              value={formData.name}
              placeholder="e.g., English, Indonesian"
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tingkat Kemampuan *</Label>
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
